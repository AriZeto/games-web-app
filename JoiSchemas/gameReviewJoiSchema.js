const normalJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = normalJoi.extend(extension); // Now we may use escapeHTML to ensure HTML is sanitized, no obvious cross scripting.

module.exports.gameJoiSchema = Joi.object({
  game: Joi.object({
    title: Joi.string().required().escapeHTML(),
    developer: Joi.string().required().escapeHTML(),
    year: Joi.number().required().min(1970).max(2030),
    cover: Joi.string().required().escapeHTML(),
    storyline: Joi.string().required().min(10).escapeHTML(),
    summary: Joi.string().required().min(10).escapeHTML(),
  }).required(),
});

module.exports.reviewJoiSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
