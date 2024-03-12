import { convertInchesToTwip } from "docx";

// 8.27 inches - width of A4 document
// 1.18 inches - left margin
// 0.39 inches - right margin
// 15 - magic twip to pixel conversion ¯\_(ツ)_/¯
export const documentWidth =
  convertInchesToTwip(8.27 - 1.18 - 0.39) / 15;
