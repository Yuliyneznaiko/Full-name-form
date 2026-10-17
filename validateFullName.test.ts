import { describe, it, expect } from "vitest";
import { validateFullName, FULL_NAME_ERRORS as E } from "./validateFullName";

const err = (s: string) => validateFullName(s).error;

describe("validateFullName", () => {
  it("requires a value", () => {
    expect(err("")).toBe(E.required);
    expect(err("    ")).toBe(E.required);
  });
  it("enforces length 2–50", () => {
    expect(err("A")).toBe(E.tooShort);
    expect(err("Al")).toBeNull();
    expect(err("a".repeat(50))).toBeNull();
    expect(err("a".repeat(51))).toBe(E.tooLong);
  });
  it("accepts letters, spaces, hyphens, apostrophes, dots", () => {
    for (const n of ["Eddie Hearn", "Anne-Marie", "O'Brien", "O’Brien", "John Smith Jr.", "Іван Петренко", "José Núñez", "Cher"])
      expect(err(n)).toBeNull();
  });
  it("rejects digits and special symbols", () => {
    for (const n of ["John3", "Jo@hn", "John_Doe", "Jo$", "😀😀"]) expect(err(n)).toBe(E.invalid);
  });
  it("trims and collapses spaces", () => {
    expect(validateFullName("  Eddie    Hearn  ").value).toBe("Eddie Hearn");
  });
});
