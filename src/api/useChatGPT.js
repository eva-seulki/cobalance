// Hugging face
export async function fetchHFResponse(userInput) {
  const API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
  const API_TOKEN = import.meta.env.VITE_HF_API_KEY; // Hugging Face Access Token
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: `<|system|>You are a helpful and friendly assistant.<|user|>${userInput}<|assistant|>`
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data?.[0]?.generated_text?.split("<|assistant|>")[1]?.trim();
}

// Open AI : 유료 크래딧 필요
export async function fetchAIResponse(userInput, phase = "emotion") {
  const systemPrompt = {
    emotion: `너는 직장 내 심리상담 코치야. 사용자의 감정 키워드를 추출하고 공감하며 더 자세한 이야기를 유도해.`,
    value: `사용자의 말에서 가치 충돌을 파악하고 그 가치를 존중해주는 말을 해줘.`,
    simulate: `사용자가 말하고자 하는 상대와 톤에 따라 정중하면서도 솔직한 대응 문장을 만들어줘.`,
    summary: `오늘의 대화에서 감정과 가치, 그리고 시도할 대응을 정리해주는 메모를 만들어줘.`
  };

  const messages = [
    { role: "system", content: systemPrompt[phase] },
    { role: "user", content: userInput }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
