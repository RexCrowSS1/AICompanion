create table if not exists users (
    id text primary key,
    display_name text not null,
    created_at timestamptz not null default now()
);

create table if not exists conversations (
    id bigserial primary key,
    user_id text not null references users(id) on delete cascade,
    title text not null default 'Obrolan Baru',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists messages (
    id bigserial primary key,
    conversation_id bigint not null references conversations(id) on delete cascade,
    role text not null check (role in ('user', 'assistant')),
    content text not null,
    created_at timestamptz not null default now()
);

create table if not exists memories (
    id bigserial primary key,
    user_id text not null references users(id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, content)
);

create index if not exists idx_messages_conversation_created
    on messages (conversation_id, created_at);

create index if not exists idx_memories_user_updated
    on memories (user_id, updated_at desc);
