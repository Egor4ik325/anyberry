class QIWIAPIError(Exception):
    data = {}
    code = "QIWIAPIError"
    message = "Error occur while using QIWI API."

    def __init__(self, message=None, code=None, data={}):
        if message:
            self.message = message
        if code:
            self.code = code
        if data:
            self.data = data

    def __str__(self):
        if self.code:
            return '{}: {}'.format(self.code, self.message)
        return self.message
