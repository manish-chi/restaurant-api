class Formatter {
  foodFormatResponse(items) {
    return items.map((item, i) => `${i + 1}. ${item.name}`).join("\n");
  }
}

export default Formatter;
