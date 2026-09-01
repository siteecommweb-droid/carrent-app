const db = require("../config/database");

// ======================================================
// NORMALIZE CAR
// ======================================================

function normalizeCar(car) {
  return {
    id: car.id,
    brand: car.brand || car.make || "Suzuki",
    model: car.model || "Swift",
    year: car.year || 2025,
    color: car.color || "White",
    av_group: car.av_group || "EDAV",
    transmission: car.transmission || "Automatic",
    fuel_type: car.fuel_type || "Petrol",
    seats: car.seats || 5,
    doors: car.doors || 4,
    luggage: car.luggage || 2,
    price_per_day: Number(car.price_per_day) || 1500,
    daily_price: Number(car.price_per_day) || 1500,
    image: car.image ? (car.image.startsWith("/") ? car.image : `/cars/${car.image}`) : "/cars/swift.jpg",
    stock_number: car.stock_number || "AM38-001",
    wow_feature: car.wow_feature || "Mauritius Premium Fleet",
    is_popular: car.is_popular === 1 || car.is_popular === true,
    available: car.available === 1 || car.available === true,
    rating: 4.8,
    review_count: 120,
    horsepower: 120,
    features: [
      "✈ Free airport assistance",
      "🏝 Mauritius local travel support",
      "🧳 Unlimited luggage help",
      "🚘 Optional chauffeur service",
      "🏨 Hotel & Airbnb booking assistance",
      "🛡 Full insurance included",
      "📍 GPS ready vehicle",
      "⚡ Instant booking confirmation"
    ]
  };
}

// ======================================================
// GET ALL CARS
// ======================================================

exports.getCars = async (req, res) => {
  try {
    const [cars] = await db.execute(`
      SELECT
        id,
        brand,
        model,
        year,
        color,
        av_group,
        transmission,
        fuel_type,
        seats,
        available,
        image,
        wow_feature,
        price_per_day,
        stock_number
      FROM cars
      ORDER BY id ASC
    `);

    const normalized = cars.map(normalizeCar);

    return res.status(200).json({
      success: true,
      count: normalized.length,
      cars: normalized
    });
  } catch (err) {
    console.error("GET CARS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
      error: err.message
    });
  }
};

// ======================================================
// GET SINGLE CAR
// ======================================================

exports.getCar = async (req, res) => {
  try {
    const [cars] = await db.execute(
      `SELECT * FROM cars WHERE id = ? LIMIT 1`,
      [req.params.id]
    );

    if (!cars.length) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    return res.json({
      success: true,
      car: normalizeCar(cars[0])
    });
  } catch (err) {
    console.error("GET CAR ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch car",
      error: err.message
    });
  }
};

// ======================================================
// UPDATE CAR PRICE
// ======================================================

exports.updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_day } = req.body;

    await db.execute(
      `UPDATE cars SET price_per_day = ? WHERE id = ?`,
      [price_per_day, id]
    );

    return res.json({
      success: true,
      message: "Price updated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update price"
    });
  }
};

// ======================================================
// GENERATE FLEET - 60 CARS WITH ALL GROUPS FROM EXCEL
// ======================================================

exports.generateFleet = async (req, res) => {
  try {
    // First, clear existing cars (optional - comment out if you want to keep)
    await db.execute("DELETE FROM cars");

    // Base car models with correct groups from your Excel
    const baseCars = [
      { brand: "Suzuki", model: "Swift", group: "EDAV", image: "swift.jpg", seats: 5, price: 1600, fuel: "Petrol" },
      { brand: "Suzuki", model: "Vitara", group: "IFAR", image: "vitara.jpg", seats: 5, price: 2600, fuel: "Petrol" },
      { brand: "Toyota", model: "Vitz", group: "CDAV", image: "vitz.jpg", seats: 5, price: 1200, fuel: "Petrol" },
      { brand: "Toyota", model: "Yaris", group: "CDAR", image: "yaris.jpg", seats: 5, price: 1800, fuel: "Petrol" },
      { brand: "Toyota", model: "Aqua", group: "HDAV", image: "aqua.jpg", seats: 5, price: 2100, fuel: "Hybrid" },
      { brand: "Suzuki", model: "Ertiga", group: "MVAR", image: "ertiga.jpg", seats: 7, price: 3200, fuel: "Petrol" },
      { brand: "Hyundai", model: "Venue", group: "SFAR", image: "magnite.jpg", seats: 5, price: 2500, fuel: "Petrol" }
    ];

    const colors = ["White", "Black", "Blue", "Grey", "Silver", "Red", "Orange", "Green", "Yellow", "Maroon"];

    let totalInserted = 0;

    for (const car of baseCars) {
      for (let i = 0; i < 10; i++) {
        const colorIndex = i % colors.length;
        await db.execute(
          `INSERT INTO cars (
            brand, model, year, color, av_group, transmission, fuel_type,
            seats, available, image, wow_feature, stock_number, price_per_day
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            car.brand,
            car.model,
            2025,
            colors[colorIndex],
            car.group,
            "Automatic",
            car.fuel,
            car.seats,
            1,
            car.image,
            `Mauritius Premium ${car.group}`,
            `${car.group}-${String(i + 1).padStart(3, "0")}`,
            car.price + (i * 50)
          ]
        );
        totalInserted++;
      }
    }

    return res.json({
      success: true,
      message: `${totalInserted} cars generated successfully`,
      count: totalInserted
    });
  } catch (err) {
    console.error("GENERATE FLEET ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Fleet generation failed",
      error: err.message
    });
  }
};