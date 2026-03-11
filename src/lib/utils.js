export function getAutoMealTiming(hour = new Date().getHours()) {

  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 19) return "snacks";
  if (hour >= 19 && hour < 23) return "dinner";
  return "late-night";
}

export function getAutoWeatherCondition(month = new Date().getMonth()) {
  // month is 0-11 (Jan-Dec)
  if (month === 11 || month === 0 || month === 1) { // Dec, Jan, Feb
    return "winter";
  }
  if (month >= 2 && month <= 5) { // Mar, Apr, May, Jun
    return "summer";
  }
  if (month >= 6 && month <= 8) { // Jul, Aug, Sep
    return "rainy";
  }
  // Oct, Nov
  return "all-season";
}
