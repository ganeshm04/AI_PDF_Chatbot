class PDFModel:
    def __init__(self, title: str, content: str):
        self.title = title
        self.content = content

    def __repr__(self):
        return f"<PDFModel(title={self.title})>"

class QAResult:
    def __init__(self, question: str, answer: str, is_correct: bool):
        self.question = question
        self.answer = answer
        self.is_correct = is_correct

    def __repr__(self):
        return f"<QAResult(question={self.question}, is_correct={self.is_correct})>"