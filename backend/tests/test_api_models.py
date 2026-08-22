import unittest

from pydantic import ValidationError

from app.main import ChatRequest


class ChatRequestTests(unittest.TestCase):
    def test_rejects_messages_longer_than_frontend_limit(self):
        with self.assertRaises(ValidationError):
            ChatRequest(message="x" * 601)


if __name__ == "__main__":
    unittest.main()
