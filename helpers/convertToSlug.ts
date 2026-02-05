import unidecode from "unidecode-plus";

function convert(str: string): string {
  str = str.toLowerCase();
  str = str.trim();
  str = str.replace(/\s+/g, "-");
  const convertedString = unidecode(str);

  return convertedString;
}

export default convert;
