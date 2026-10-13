// Loads quiz questions from the XML file
export async function loadQuestions() {
  const response = await fetch("/data/questions.xml");

  if (!response.ok) {
    throw new Error("Could not load quiz questions");
  }

  const xmlText = await response.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");

  const questionList = xml.querySelectorAll("question");

  const questions = [];

  questionList.forEach((question) => {
    const options = [];

    question.querySelectorAll("option").forEach((option) => {
      options.push(option.textContent);
    });

    questions.push({
      id: question.getAttribute("id"),
      category: question.querySelector("category").textContent,
      level: question.querySelector("level").textContent,
      text: question.querySelector("text").textContent,
      options: options,
      answer: question.querySelector("answer").textContent,
    });
  });

  return questions;
}