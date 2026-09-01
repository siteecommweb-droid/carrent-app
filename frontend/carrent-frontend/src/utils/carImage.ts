export function getCarImage(car: any, angle: number = 0): string {
  const make = car.make?.toLowerCase() || "";
  const model = car.model?.toLowerCase() || "";

  // Toyota models
  if (model.includes("yaris")) return "/cars/yaris.jpg";
  if (model.includes("vitz")) return "/cars/vitz.jpg";
  if (model.includes("corolla")) return "/cars/corolla.jpg";
  if (model.includes("aqua")) return "/cars/aqua.jpg";
  
  // Suzuki models
  if (model.includes("swift")) return "/cars/swift.jpg";
  if (model.includes("vitara")) return "/cars/vitara.jpg";
  if (model.includes("ertiga")) return "/cars/ertiga.jpg";
  
  // Nissan models
  if (model.includes("magnite")) return "/cars/magnite.jpg";
  if (model.includes("note")) return "/cars/note.jpg";
  
  // Hyundai models
  if (model.includes("i10")) return "/cars/i10.jpg";
  if (model.includes("i20")) return "/cars/i20.jpg";
  if (model.includes("venue")) return "/cars/venue.jpg";
  
  // Honda models
  if (model.includes("fit")) return "/cars/fit.jpg";
  if (model.includes("city")) return "/cars/city.jpg";
  
  // Mitsubishi models
  if (model.includes("outlander")) return "/cars/outlander.jpg";
  if (model.includes("shuttle")) return "/cars/shuttle.jpg";
  
  // Fallback based on make
  if (make.includes("toyota")) return "/cars/toyota.jpg";
  if (make.includes("suzuki")) return "/cars/suzuki.jpg";
  if (make.includes("nissan")) return "/cars/nissan.jpg";
  if (make.includes("hyundai")) return "/cars/hyundai.jpg";
  if (make.includes("honda")) return "/cars/honda.jpg";
  
  return "/cars/default.jpg";
}