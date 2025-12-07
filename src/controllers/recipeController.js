const OpenAI = require("openai");
const Joi = require("joi");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const recipeSchema = Joi.object({
  ingredients: Joi.string().max(500).required()
});

const generateRecipe = async (req, res) => {
  const { error, value } = recipeSchema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { ingredients } = value;

  try {
    const prompt = `Generate a recipe using the following ingredients: ${ingredients}. Provide the recipe name, ingredients list, and step-by-step instructions.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates recipes." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const recipe = response.choices[0].message.content;
    res.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error.code === "insufficient_quota") {
      return res.status(429).json({ message: "OpenAI quota exhausted." });
    }
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};

module.exports = {
  generateRecipe
};