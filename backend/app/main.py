from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .companion import build_reply
from .db import get_conn
from .settings import settings


app = FastAPI(title="Eclps Assistance")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None


class ChatResponse(BaseModel):
    conversation_id: int
    reply: str
    intent: str
    mood: str
    saved_memory: str | None = None


class ResetSessionResponse(BaseModel):
    ok: bool
    deleted_conversations: int
    deleted_memories: int


def ensure_demo_user(conn):
    conn.execute(
        """
        insert into users (id, display_name)
        values (%s, %s)
        on conflict (id) do nothing
        """,
        (settings.app_user_id, "Demo User"),
    )


def get_or_create_conversation(conn, conversation_id: int | None) -> int:
    ensure_demo_user(conn)
    if conversation_id:
        row = conn.execute(
            "select id from conversations where id = %s and user_id = %s",
            (conversation_id, settings.app_user_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conversation_id

    row = conn.execute(
        """
        insert into conversations (user_id, title)
        values (%s, %s)
        returning id
        """,
        (settings.app_user_id, "Obrolan Baru"),
    ).fetchone()
    return row["id"]


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/session/reset", response_model=ResetSessionResponse)
def reset_session():
    with get_conn() as conn:
        ensure_demo_user(conn)
        deleted_memories = conn.execute(
            "delete from memories where user_id = %s",
            (settings.app_user_id,),
        ).rowcount
        deleted_conversations = conn.execute(
            "delete from conversations where user_id = %s",
            (settings.app_user_id,),
        ).rowcount

    return ResetSessionResponse(
        ok=True,
        deleted_conversations=deleted_conversations,
        deleted_memories=deleted_memories,
    )


@app.get("/conversations/{conversation_id}/messages")
def list_messages(conversation_id: int):
    with get_conn() as conn:
        rows = conn.execute(
            """
            select role, content, created_at
            from messages
            where conversation_id = %s
            order by created_at asc, id asc
            """,
            (conversation_id,),
        ).fetchall()
    return {"messages": rows}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    text = payload.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    with get_conn() as conn:
        conversation_id = get_or_create_conversation(conn, payload.conversation_id)

        recent_messages = conn.execute(
            """
            select role, content
            from messages
            where conversation_id = %s
            order by created_at desc, id desc
            limit 12
            """,
            (conversation_id,),
        ).fetchall()
        recent_messages = list(reversed(recent_messages))

        memories = conn.execute(
            """
            select id, content
            from memories
            where user_id = %s
            order by updated_at desc
            limit 100
            """,
            (settings.app_user_id,),
        ).fetchall()

        result = build_reply(text, memories, recent_messages)

        conn.execute(
            "insert into messages (conversation_id, role, content) values (%s, %s, %s)",
            (conversation_id, "user", text),
        )
        conn.execute(
            "insert into messages (conversation_id, role, content) values (%s, %s, %s)",
            (conversation_id, "assistant", result["reply"]),
        )

        if result["new_memory"]:
            conn.execute(
                """
                insert into memories (user_id, content)
                values (%s, %s)
                on conflict (user_id, content)
                do update set updated_at = now()
                """,
                (settings.app_user_id, result["new_memory"]),
            )

    return ChatResponse(
        conversation_id=conversation_id,
        reply=result["reply"],
        intent=result["intent"],
        mood=result["mood"],
        saved_memory=result["new_memory"],
    )
