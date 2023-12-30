export function removeHtmlTags(htmlStr: string) {
  return (
    htmlStr
      // replacing html tags
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&nbsp;/gi, " ")
  );
}
