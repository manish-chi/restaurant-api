class Formatter {
  foodFormatResponse(items) {
    return items.map((item, i) => `${i + 1}. ${item.name}`).join("\n");
  }

  MenuTimeOfDay(){
    let hours = new Date().getHours();
    if(hours >=6 && hours <= 11) return "breakfast";
    return "lunch";
  }
}

export default Formatter;
