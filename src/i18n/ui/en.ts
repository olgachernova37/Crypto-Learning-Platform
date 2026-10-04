// English is the source dictionary. Keys are grouped by area of the app.
// Values are strings, or small functions for text with numbers/names in it.
import { account } from "./en/account";
import { admin } from "./en/admin";
import { ai } from "./en/ai";
import { common } from "./en/common";
import { finale } from "./en/finale";
import { home } from "./en/home";
import { journey } from "./en/journey";
import { lesson } from "./en/lesson";
import { partners } from "./en/partners";
import { practice } from "./en/practice";
import { privacy } from "./en/privacy";
import { progress } from "./en/progress";
import { quiz } from "./en/quiz";
import { share } from "./en/share";
import { shell } from "./en/shell";
import { voyage } from "./en/voyage";
import { wallet } from "./en/wallet";

export const en = { common, shell, home, journey, lesson, quiz, ai, practice, wallet, finale, progress, partners, account, admin, voyage, privacy, share };
export type Dict = typeof en;
