import unittest

class TestSearchQueryGenerator(unittest.TestCase):
    def setUp(self):
        """Set up test environment before each test"""
        self.generator = SearchQueryGenerator()
        
    def test_process_phrase(self):
        """Test phrase processing functionality"""
        test_cases = [
            ("Python Programming Tutorial", ["python", "programming", "tutorial"]),
            ("The Best Quick Guide", ["best", "quick", "guide"]),
            ("A Simple Test", ["simple", "test"])
        ]
        
        for input_phrase, expected in test_cases:
            with self.subTest(input_phrase=input_phrase):
                result = self.generator.processPhrase(input_phrase)
                self.assertEqual(result, expected)

    def test_generate_search