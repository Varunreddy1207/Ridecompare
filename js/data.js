// Rich Data Models for VOZX RideCompare

const APP_DATA = {
  user: {
    name: "Varun Reddy",
    email: "varunreddy@gmail.com",
    phone: "+91 98765 43210",
    avatar: "VR",
    stats: {
      totalSavings: 3450,
      totalTrips: 48,
      carbonSaved: 18.4, // kg CO2
      memberSince: "Jan 2025",
      rating: 4.92
    },
    preferences: {
      defaultMode: "all",
      preferEv: false,
      acMandatory: false,
      helmetProvided: true,
      darkModeOled: true,
      soundEffects: true,
      language: "English"
    }
  },

  defaultRoute: {
    pickup: {
      name: "Current Location",
      address: "Near Sangli-Kolhapur Road, Ichalkaranji",
      lat: 16.6975,
      lng: 74.4571
    },
    destination: {
      name: "Sanjay Ghodawat University",
      address: "Kolhapur-Sangli Highway, Atigre, Maharashtra 416118",
      lat: 16.7450,
      lng: 74.3725
    },
    distanceKm: 4.2,
    estimatedMinutes: 12
  },

  recentDestinations: [
    {
      id: "dest-1",
      name: "Sanjay Ghodawat University",
      subtitle: "Kolhapur-Sangli Highway, Atigre",
      city: "Ichalkaranji",
      icon: "graduation-cap",
      distance: "4.2 km",
      lat: 16.7450,
      lng: 74.3725
    },
    {
      id: "dest-2",
      name: "Pune Junction Railway Station",
      subtitle: "Agarkar Nagar, Pune",
      city: "Pune",
      icon: "train",
      distance: "235 km",
      lat: 18.5284,
      lng: 73.8744
    },
    {
      id: "dest-3",
      name: "Home",
      subtitle: "Near Ring Road, Ichalkaranji",
      city: "Ichalkaranji",
      icon: "home",
      distance: "1.8 km",
      lat: 16.7020,
      lng: 74.4650
    },
    {
      id: "dest-4",
      name: "Kolhapur Central Bus Stand (CBS)",
      subtitle: "New Shahupuri, Kolhapur",
      city: "Kolhapur",
      icon: "bus",
      distance: "28 km",
      lat: 16.7050,
      lng: 74.2433
    },
    {
      id: "dest-5",
      name: "Chhatrapati Rajaram Airport",
      subtitle: "Ujalaiwadi, Kolhapur",
      city: "Kolhapur",
      icon: "plane",
      distance: "32 km",
      lat: 16.6644,
      lng: 74.2818
    },
    {
      id: "dest-6",
      name: "City Center Mall",
      subtitle: "Main Road, Ichalkaranji",
      city: "Ichalkaranji",
      icon: "shopping-bag",
      distance: "3.1 km",
      lat: 16.6910,
      lng: 74.4610
    }
  ],

  savedPlaces: [
    {
      id: "saved-home",
      type: "home",
      title: "Home",
      address: "Plot 42, Green Park, Ring Road, Ichalkaranji",
      icon: "home",
      tag: "Favorite",
      lat: 16.7020,
      lng: 74.4650
    },
    {
      id: "saved-college",
      type: "college",
      title: "College (SGU)",
      address: "Sanjay Ghodawat University, Atigre Campus",
      icon: "book-open",
      tag: "Daily Commute",
      lat: 16.7450,
      lng: 74.3725
    },
    {
      id: "saved-gym",
      type: "gym",
      title: "Gym (Iron Core)",
      address: "Lane 3, Station Road, Ichalkaranji",
      icon: "dumbbell",
      tag: "Workout",
      lat: 16.6980,
      lng: 74.4530
    },
    {
      id: "saved-airport",
      type: "airport",
      title: "Airport",
      address: "Kolhapur Domestic Airport Terminal 1",
      icon: "plane-takeoff",
      tag: "Travel",
      lat: 16.6644,
      lng: 74.2818
    },
    {
      id: "saved-work",
      type: "work",
      title: "Tech Park / Office",
      address: "Software Zone, Cyber City, Phase 2",
      icon: "briefcase",
      tag: "Work",
      lat: 16.7150,
      lng: 74.4200
    }
  ],

  // Real-time ride comparisons across 5+ providers
  rides: [
    {
      id: "rapido-bike",
      provider: "Rapido",
      category: "bike",
      categoryName: "Bike Taxi",
      vehicleName: "Rapido Bike",
      price: 78,
      originalPrice: 95,
      etaMins: 12,
      driverDistanceMin: 3,
      rating: 4.8,
      reviews: "1.4M",
      badge: "Cheapest",
      badgeColor: "success", // green
      discount: "18% OFF",
      features: ["Fastest in traffic", "Sanitized helmet provided", "Single rider"],
      fareBreakdown: {
        baseFare: 35,
        distanceFare: 32,
        taxes: 4,
        platformFee: 0,
        couponDiscount: 15,
        surge: 1.0
      },
      driver: {
        name: "Rajesh Patil",
        rating: 4.9,
        trips: "2,450",
        vehicle: "Bajaj Pulsar 150 (Black)",
        plate: "MH 09 CW 9812",
        otp: "4921",
        phone: "+91 98234 56789"
      }
    },
    {
      id: "ola-bike",
      provider: "Ola",
      category: "bike",
      categoryName: "Bike",
      vehicleName: "Ola Bike",
      price: 92,
      originalPrice: 105,
      etaMins: 14,
      driverDistanceMin: 4,
      rating: 4.6,
      reviews: "980K",
      badge: "Popular",
      badgeColor: "cyan",
      discount: "12% OFF",
      features: ["Verified rider", "Live GPS tracking", "Affordable"],
      fareBreakdown: {
        baseFare: 40,
        distanceFare: 42,
        taxes: 5,
        platformFee: 0,
        couponDiscount: 10,
        surge: 1.05
      },
      driver: {
        name: "Suresh Kamble",
        rating: 4.7,
        trips: "1,820",
        vehicle: "Hero Splendor Pro",
        plate: "MH 09 BE 1409",
        otp: "7732",
        phone: "+91 97654 32190"
      }
    },
    {
      id: "uber-moto",
      provider: "Uber",
      category: "bike",
      categoryName: "Moto",
      vehicleName: "Uber Moto",
      price: 105,
      originalPrice: 120,
      etaMins: 15,
      driverDistanceMin: 5,
      rating: 4.7,
      reviews: "2.1M",
      badge: "Uber Safety",
      badgeColor: "blue",
      discount: "10% OFF",
      features: ["Ride check safety", "Doorstep pickup", "Insurance included"],
      fareBreakdown: {
        baseFare: 45,
        distanceFare: 50,
        taxes: 6,
        platformFee: 2,
        couponDiscount: 8,
        surge: 1.0
      },
      driver: {
        name: "Amit Desai",
        rating: 4.8,
        trips: "3,100",
        vehicle: "Honda Shine (Grey)",
        plate: "MH 09 AZ 6634",
        otp: "3189",
        phone: "+91 91234 88765"
      }
    },
    {
      id: "rapido-auto",
      provider: "Rapido",
      category: "auto",
      categoryName: "Auto",
      vehicleName: "Rapido Auto",
      price: 110,
      originalPrice: 125,
      etaMins: 14,
      driverDistanceMin: 4,
      rating: 4.7,
      reviews: "750K",
      badge: "Fastest Auto",
      badgeColor: "cyan",
      discount: "₹15 OFF",
      features: ["No bargaining", "Direct pickup", "Fits up to 3"],
      fareBreakdown: {
        baseFare: 50,
        distanceFare: 52,
        taxes: 6,
        platformFee: 0,
        couponDiscount: 15,
        surge: 1.0
      },
      driver: {
        name: "Vinayak Shinde",
        rating: 4.8,
        trips: "4,120",
        vehicle: "Bajaj RE Compact Auto",
        plate: "MH 09 DF 4310",
        otp: "5512",
        phone: "+91 98451 22334"
      }
    },
    {
      id: "namma-auto",
      provider: "Namma Yatri",
      category: "auto",
      categoryName: "Community Auto",
      vehicleName: "Namma Yatri Auto",
      price: 112,
      originalPrice: 112,
      etaMins: 13,
      driverDistanceMin: 3,
      rating: 4.9,
      reviews: "450K",
      badge: "100% to Driver",
      badgeColor: "orange",
      discount: "Zero Commission",
      features: ["Direct driver payment", "Community supported", "Fast response"],
      fareBreakdown: {
        baseFare: 50,
        distanceFare: 56,
        taxes: 6,
        platformFee: 0,
        couponDiscount: 0,
        surge: 1.0
      },
      driver: {
        name: "Maruti Pawar",
        rating: 4.95,
        trips: "1,940",
        vehicle: "Piaggio Ape Auto",
        plate: "MH 09 BK 8901",
        otp: "6210",
        phone: "+91 98901 77654"
      }
    },
    {
      id: "uber-auto",
      provider: "Uber",
      category: "auto",
      categoryName: "Auto",
      vehicleName: "Uber Auto",
      price: 118,
      originalPrice: 135,
      etaMins: 16,
      driverDistanceMin: 5,
      rating: 4.6,
      reviews: "1.2M",
      badge: "Top Rated",
      badgeColor: "blue",
      discount: "Cashless",
      features: ["Auto meter rate", "Fixed upfront price", "Share trip pin"],
      fareBreakdown: {
        baseFare: 55,
        distanceFare: 56,
        taxes: 6,
        platformFee: 1,
        couponDiscount: 10,
        surge: 1.0
      },
      driver: {
        name: "Ganesh Kadam",
        rating: 4.7,
        trips: "3,400",
        vehicle: "Bajaj Maxima Auto",
        plate: "MH 09 EF 2289",
        otp: "8841",
        phone: "+91 97652 33110"
      }
    },
    {
      id: "ola-auto",
      provider: "Ola",
      category: "auto",
      categoryName: "Auto",
      vehicleName: "Ola Auto",
      price: 142,
      originalPrice: 160,
      etaMins: 18,
      driverDistanceMin: 6,
      rating: 4.5,
      reviews: "1.8M",
      badge: "Guaranteed",
      badgeColor: "cyan",
      discount: "Ola Money",
      features: ["Doorstep pickup", "Verified driver", "Emergency SOS"],
      fareBreakdown: {
        baseFare: 65,
        distanceFare: 68,
        taxes: 8,
        platformFee: 1,
        couponDiscount: 0,
        surge: 1.15
      },
      driver: {
        name: "Dattatraya More",
        rating: 4.6,
        trips: "5,100",
        vehicle: "Bajaj RE Auto",
        plate: "MH 09 CD 7712",
        otp: "2940",
        phone: "+91 94231 66789"
      }
    },
    {
      id: "uber-go",
      provider: "Uber",
      category: "cab",
      categoryName: "Cab (AC Sedan)",
      vehicleName: "Uber Go",
      price: 168,
      originalPrice: 195,
      etaMins: 18,
      driverDistanceMin: 6,
      rating: 4.85,
      reviews: "3.4M",
      badge: "Best Value Cab",
      badgeColor: "blue",
      discount: "AC Comfort",
      features: ["Air conditioned", "Spacious 4-seater", "Top rated drivers"],
      fareBreakdown: {
        baseFare: 80,
        distanceFare: 78,
        taxes: 12,
        platformFee: 3,
        couponDiscount: 15,
        surge: 1.0
      },
      driver: {
        name: "Anand Bhosale",
        rating: 4.88,
        trips: "6,200",
        vehicle: "Maruti Suzuki Dzire (White)",
        plate: "MH 09 FC 1234",
        otp: "9102",
        phone: "+91 98220 11223"
      }
    },
    {
      id: "blusmart-ev",
      provider: "BluSmart",
      category: "ev",
      categoryName: "100% Electric",
      vehicleName: "BluSmart EV",
      price: 185,
      originalPrice: 210,
      etaMins: 20,
      driverDistanceMin: 7,
      rating: 4.95,
      reviews: "320K",
      badge: "Zero Emission",
      badgeColor: "success",
      discount: "Zero Surge",
      features: ["100% Electric EV", "No cancellation guarantee", "Clean & quiet"],
      fareBreakdown: {
        baseFare: 90,
        distanceFare: 85,
        taxes: 10,
        platformFee: 0,
        couponDiscount: 10,
        surge: 1.0
      },
      driver: {
        name: "Vikram Mane",
        rating: 4.96,
        trips: "2,150",
        vehicle: "Tata Tigor EV (Teal Blue)",
        plate: "MH 09 EV 0042",
        otp: "4419",
        phone: "+91 97665 44321"
      }
    },
    {
      id: "uber-xl",
      provider: "Uber",
      category: "suv",
      categoryName: "SUV 6-Seater",
      vehicleName: "Uber XL",
      price: 245,
      originalPrice: 280,
      etaMins: 22,
      driverDistanceMin: 8,
      rating: 4.82,
      reviews: "1.1M",
      badge: "Extra Space",
      badgeColor: "blue",
      discount: "Spacious",
      features: ["Up to 6 seats", "Large trunk luggage", "Luxury comfort"],
      fareBreakdown: {
        baseFare: 120,
        distanceFare: 110,
        taxes: 18,
        platformFee: 5,
        couponDiscount: 15,
        surge: 1.05
      },
      driver: {
        name: "Sanjay Chavan",
        rating: 4.84,
        trips: "4,800",
        vehicle: "Toyota Innova Crysta (Silver)",
        plate: "MH 09 GT 9900",
        otp: "1845",
        phone: "+91 99221 44556"
      }
    }
  ],

  // AI smart recommendation computed insights
  aiRecommendation: {
    smartScore: 98,
    trafficStatus: "Light Traffic (Speed: 38 km/h)",
    weatherStatus: "Clear Sky · 28°C · Rain Surge: 0%",
    demandStatus: "Normal Demand (No Surge)",
    cheapest: {
      provider: "Rapido Bike",
      price: 78,
      savings: "Save ₹64 vs Uber Go",
      eta: "12 mins"
    },
    fastest: {
      provider: "Rapido Bike / Auto",
      eta: "12 mins",
      speedBenefit: "Arrive 6 mins before car"
    },
    bestValue: {
      provider: "Uber Go Cab",
      price: 168,
      reason: "AC Comfort for just ₹58 extra over Auto"
    },
    moneySavedToday: 142,
    predictedNextDrop: {
      inMinutes: 10,
      savingsAmount: 22,
      probability: 86
    }
  },

  // 30-minute AI Price Predictor curve
  pricePredictionSeries: [
    { minute: "Now", price: 78, surge: "1.0x", state: "Current" },
    { minute: "+5m", price: 72, surge: "0.95x", state: "Falling" },
    { minute: "+10m", price: 56, surge: "0.85x", state: "Lowest" },
    { minute: "+15m", price: 64, surge: "0.90x", state: "Rising" },
    { minute: "+20m", price: 82, surge: "1.10x", state: "Peak" },
    { minute: "+25m", price: 95, surge: "1.25x", state: "High Surge" },
    { minute: "+30m", price: 88, surge: "1.15x", state: "Easing" }
  ],

  // Ride History
  rideHistory: [
    {
      id: "trip-101",
      provider: "Ola",
      vehicleType: "Bike Taxi",
      category: "bike",
      from: "Sanjay Ghodawat University",
      to: "Home, Ichalkaranji",
      date: "12 Sep, 07:45 PM",
      price: 96,
      distance: "4.2 km",
      duration: "14 min",
      rating: 5,
      driverName: "Suresh K.",
      status: "Completed",
      paymentMethod: "VOZX Wallet",
      invoiceNumber: "VOZX-INV-8921"
    },
    {
      id: "trip-102",
      provider: "Rapido",
      vehicleType: "Bike Taxi",
      category: "bike",
      from: "College (SGU)",
      to: "City Center Mall",
      date: "10 Sep, 06:20 PM",
      price: 82,
      distance: "3.8 km",
      duration: "11 min",
      rating: 5,
      driverName: "Rajesh P.",
      status: "Completed",
      paymentMethod: "Google Pay UPI",
      invoiceNumber: "VOZX-INV-8740"
    },
    {
      id: "trip-103",
      provider: "Uber",
      vehicleType: "Uber Auto",
      category: "auto",
      from: "Kolhapur Railway Station",
      to: "College (SGU)",
      date: "8 Sep, 05:10 PM",
      price: 138,
      distance: "12.4 km",
      duration: "26 min",
      rating: 4,
      driverName: "Amit D.",
      status: "Completed",
      paymentMethod: "PhonePe",
      invoiceNumber: "VOZX-INV-8512"
    },
    {
      id: "trip-104",
      provider: "Ola",
      vehicleType: "Prime Sedan (AC)",
      category: "cab",
      from: "Chhatrapati Rajaram Airport",
      to: "Home, Ichalkaranji",
      date: "5 Sep, 09:30 AM",
      price: 165,
      distance: "16.1 km",
      duration: "32 min",
      rating: 5,
      driverName: "Anand B.",
      status: "Completed",
      paymentMethod: "HDFC Credit Card",
      invoiceNumber: "VOZX-INV-8109"
    },
    {
      id: "trip-105",
      provider: "Rapido",
      vehicleType: "Bike Taxi",
      category: "bike",
      from: "College (SGU)",
      to: "Main Market",
      date: "2 Sep, 08:15 PM",
      price: 74,
      distance: "3.2 km",
      duration: "9 min",
      rating: 5,
      driverName: "Vinod R.",
      status: "Completed",
      paymentMethod: "Paytm UPI",
      invoiceNumber: "VOZX-INV-7982"
    }
  ],

  // Offers and Scratch Cards
  offers: [
    {
      id: "off-1",
      provider: "Uber",
      code: "UBERVOZX30",
      title: "Flat 30% OFF on Uber Go",
      desc: "Valid on all cab bookings up to ₹75 discount.",
      validTill: "30 Sep 2026",
      tag: "Trending",
      badgeColor: "blue"
    },
    {
      id: "off-2",
      provider: "Rapido",
      code: "RAPIDOFIRST",
      title: "Flat ₹25 Cashback on Bike",
      desc: "Direct cashback to VOZX wallet on your next 3 rides.",
      validTill: "15 Oct 2026",
      tag: "Cashback",
      badgeColor: "success"
    },
    {
      id: "off-3",
      provider: "Ola",
      code: "OLAPAY50",
      title: "Save ₹50 on Auto & Cab",
      desc: "Use code for instant rebate on Ola ride passes.",
      validTill: "05 Oct 2026",
      tag: "Instant Off",
      badgeColor: "cyan"
    },
    {
      id: "off-4",
      provider: "Bank Partner",
      code: "HDFCVOZX15",
      title: "15% Cashback via HDFC UPI",
      desc: "Get up to ₹100 cashback when paying with HDFC Bank accounts.",
      validTill: "31 Oct 2026",
      tag: "Bank Offer",
      badgeColor: "orange"
    },
    {
      id: "off-5",
      provider: "Student Club",
      code: "CAMPUSPASS",
      title: "20% Daily Student Discount",
      desc: "Special university commuter pass for verified students.",
      validTill: "31 Dec 2026",
      tag: "Student Special",
      badgeColor: "success"
    }
  ],

  scratchCards: [
    {
      id: "sc-1",
      scratched: false,
      prizeText: "₹50 VOZX Cash",
      subText: "Credited instantly to your wallet!",
      color: "from-blue-600 to-cyan-400"
    },
    {
      id: "sc-2",
      scratched: false,
      prizeText: "Free Auto Ride Pass",
      subText: "100% OFF up to ₹100 on next ride!",
      color: "from-emerald-500 to-teal-400"
    },
    {
      id: "sc-3",
      scratched: true,
      prizeText: "₹25 Rapido Cashback",
      subText: "Claimed & added to balance",
      color: "from-amber-500 to-orange-400"
    }
  ],

  // Wallet
  wallet: {
    balance: 420.50,
    cashbackEarned: 1280.00,
    upiId: "varun.reddy@oksbi",
    savedCards: [
      {
        id: "card-1",
        bank: "HDFC Millennia",
        last4: "8821",
        network: "Visa",
        exp: "08/29",
        gradient: "from-slate-900 via-blue-950 to-slate-900"
      },
      {
        id: "card-2",
        bank: "ICICI Sapphiro",
        last4: "3104",
        network: "Mastercard",
        exp: "11/28",
        gradient: "from-slate-950 via-cyan-950 to-slate-900"
      }
    ],
    transactions: [
      {
        id: "tx-501",
        title: "Cashback: VOZX AI Prediction Save",
        type: "credit",
        amount: 25.00,
        date: "Today, 08:30 AM",
        icon: "sparkles",
        status: "Success"
      },
      {
        id: "tx-502",
        title: "Rapido Bike Ride Payment",
        type: "debit",
        amount: 78.00,
        date: "Yesterday, 06:45 PM",
        icon: "arrow-up-right",
        status: "Success"
      },
      {
        id: "tx-503",
        title: "Added Money via PhonePe",
        type: "credit",
        amount: 500.00,
        date: "25 Sep, 11:20 AM",
        icon: "wallet",
        status: "Success"
      },
      {
        id: "tx-504",
        title: "Ola Auto Trip Fare",
        type: "debit",
        amount: 142.00,
        date: "22 Sep, 02:15 PM",
        icon: "arrow-up-right",
        status: "Success"
      },
      {
        id: "tx-505",
        title: "Referral Bonus: Invited Rahul",
        type: "credit",
        amount: 100.00,
        date: "18 Sep, 04:00 PM",
        icon: "gift",
        status: "Success"
      }
    ]
  },

  // Notifications
  notifications: [
    {
      id: "notif-1",
      title: "Ride Booked Successfully",
      desc: "Rapido Bike with Rajesh Patil is arriving in 3 mins. PIN: 4921",
      time: "2 mins ago",
      type: "ride",
      unread: true,
      icon: "check-circle",
      iconColor: "text-emerald-400"
    },
    {
      id: "notif-2",
      title: "Price Drop Alert! 📉",
      desc: "Uber Go prices to Sanjay Ghodawat University dropped 18% right now.",
      time: "15 mins ago",
      type: "price",
      unread: true,
      icon: "trending-down",
      iconColor: "text-cyan-400"
    },
    {
      id: "notif-3",
      title: "₹25 Cashback Credited",
      desc: "Your smart ride reward has been deposited into your VOZX Wallet.",
      time: "2 hours ago",
      type: "wallet",
      unread: false,
      icon: "gift",
      iconColor: "text-blue-400"
    },
    {
      id: "notif-4",
      title: "Rain Alert in Kolhapur-Ichalkaranji",
      desc: "Light shower forecasted at 5 PM. Pre-book to avoid auto surge.",
      time: "5 hours ago",
      type: "system",
      unread: false,
      icon: "cloud-rain",
      iconColor: "text-amber-400"
    },
    {
      id: "notif-5",
      title: "Weekend Pass Active",
      desc: "Enjoy zero platform fee on all Ola, Uber, and Rapido rides this weekend.",
      time: "1 day ago",
      type: "offer",
      unread: false,
      icon: "tag",
      iconColor: "text-purple-400"
    }
  ]
};

window.APP_DATA = APP_DATA;
