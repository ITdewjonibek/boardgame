from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class OptionBase(BaseModel):
    text: str

class OptionCreate(OptionBase):
    pass

class Option(OptionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class QuestionBase(BaseModel):
    text: str
    correct_option: int
    options: List[OptionCreate]

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    options: List[Option]
    model_config = ConfigDict(from_attributes=True)

class TestBase(BaseModel):
    title: str
    subject_id: int
    teacher_name: str

class TestCreate(TestBase):
    questions: List[QuestionCreate]
    section_id: Optional[int] = None
    difficulty: str = "medium"

class Test(TestBase):
    id: int
    questions: List[Question]
    section_id: Optional[int] = None
    difficulty: str = "medium"
    model_config = ConfigDict(from_attributes=True)

class SectionBase(BaseModel):
    title: str
    subject_id: int
    teacher_name: str

class SectionCreate(SectionBase):
    pass

class Section(SectionBase):
    id: int
    created_at: datetime
    tests: List[Test] = []
    model_config = ConfigDict(from_attributes=True)

class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
