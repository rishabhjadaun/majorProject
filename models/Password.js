const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  password: { type: String, required: true },
});

passwordSchema.statics.setPassword = async function (newPassword) {
  const existing = await this.findOne();
  if (existing) {
    existing.password = newPassword;
    return await existing.save();
  } else {
    return await this.create({ password: newPassword });
  }
};

module.exports = mongoose.model("Password", passwordSchema);
