import http.client
import json
import unittest
from unittest.mock import patch

from app.companion import build_reply, detect_intent, extract_memory, ollama_reply, tokenize
from app.settings import settings


class FakeResponse:
    def __init__(self, body: bytes):
        self.body = body

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return self.body


class OllamaReplyTests(unittest.TestCase):
    def setUp(self):
        self.original_model = settings.ollama_model
        settings.ollama_model = "test-model"

    def tearDown(self):
        settings.ollama_model = self.original_model

    def call_ollama(self):
        return ollama_reply("halo", [], [], "neutral", "greeting")

    def test_returns_content_from_valid_response(self):
        body = json.dumps({"message": {"content": "  line online  "}}).encode()
        with patch("app.companion.urllib.request.urlopen", return_value=FakeResponse(body)):
            self.assertEqual(self.call_ollama(), "line online")

    def test_returns_none_for_malformed_responses(self):
        bodies = [
            b"[]",
            b"null",
            b'{"message": null}',
            b'{"message": {"content": 123}}',
            b"not-json",
            b"\xff",
        ]
        for body in bodies:
            with self.subTest(body=body):
                with patch("app.companion.urllib.request.urlopen", return_value=FakeResponse(body)):
                    self.assertIsNone(self.call_ollama())

    def test_returns_none_for_incomplete_response(self):
        with patch(
            "app.companion.urllib.request.urlopen",
            side_effect=http.client.IncompleteRead(b"partial"),
        ):
            self.assertIsNone(self.call_ollama())


class CrisisReplyTests(unittest.TestCase):
    def test_crisis_variants_bypass_model_and_are_not_saved_as_memory(self):
        messages = [
            "aku ingin mati",
            "gue pengen mati",
            "aku nggak mau hidup lagi",
            "aku kepikiran self-harm",
        ]
        for message in messages:
            with self.subTest(message=message):
                with patch("app.companion.ollama_reply", side_effect=AssertionError("model must not run")):
                    result = build_reply(message, [], [])
                self.assertEqual(result["intent"], "crisis")
                self.assertIsNone(result["new_memory"])
                self.assertIn("keselamatan", result["reply"].lower())


class IntentAndMemoryTests(unittest.TestCase):
    def test_keywords_only_match_complete_words_and_vent_beats_greeting(self):
        cases = {
            "akhirnya tugas selesai": "chat",
            "this feels difficult": "chat",
            "semalaman aku cemas": "vent",
            "Hai, aku sedih dan capek": "vent",
        }
        for message, expected in cases.items():
            with self.subTest(message=message):
                self.assertEqual(detect_intent(message, tokenize(message)), expected)

    def test_memory_only_captures_direct_stable_or_explicit_facts(self):
        self.assertIsNone(extract_memory("Temanku berkata: aku suka durian"))
        self.assertIsNone(extract_memory("aku sedang sedih"))
        self.assertEqual(extract_memory("aku suka kopi"), "aku suka kopi")
        self.assertLessEqual(len(extract_memory("ingat " + "x" * 500)), 160)

    def test_explicit_recall_uses_recent_memories_without_word_overlap(self):
        original_model = settings.ollama_model
        settings.ollama_model = ""
        try:
            result = build_reply(
                "Apa yang kamu ingat tentangku?",
                [{"content": "aku suka kopi"}],
                [],
            )
        finally:
            settings.ollama_model = original_model
        self.assertEqual(result["intent"], "identity")
        self.assertEqual(result["used_memories"], [{"content": "aku suka kopi"}])


if __name__ == "__main__":
    unittest.main()
