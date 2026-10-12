import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error(" error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

const CATEGORY_CATALOG = [
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea2",
    videotitle: "Aesthetic Productive Study Vlog: 4-Hour Study With Me & Exam Prep",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.4MB",
    videochanel: "Study & Productivity Vlogs",
    category: "Education",
    Like: 4890,
    views: 165000,
    uploader: "study_vlogger",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e8f",
    videotitle: "Learn To Build a Real Time Website Like YouTube",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "930KB",
    videochanel: "Elevanceskills Tech",
    category: "Technology",
    Like: 1250,
    views: 45000,
    uploader: "instructor",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e90",
    videotitle: "Full-Stack Next.js 15 & Node.js Masterclass",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.2MB",
    videochanel: "Web Dev Simplified",
    category: "Education",
    Like: 3420,
    views: 128000,
    uploader: "code_master",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e91",
    videotitle: "React 19 & WebRTC Real-Time Watch Party Gameplay",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "850KB",
    videochanel: "CodeWithTech",
    category: "Gaming",
    Like: 890,
    views: 23000,
    uploader: "tech_guru",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e92",
    videotitle: "Razorpay Payment Gateway Integration Guide",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "930KB",
    videochanel: "Fintech Academy",
    category: "Education",
    Like: 2150,
    views: 67000,
    uploader: "fintech_pro",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e93",
    videotitle: "Global Tech News & Software Trends 2026",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.1MB",
    videochanel: "World News Daily",
    category: "News",
    Like: 1420,
    views: 89000,
    uploader: "news_desk",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e94",
    videotitle: "Live Esports Championship & Football Highlights",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.5MB",
    videochanel: "Sports Zone",
    category: "Sports",
    Like: 2890,
    views: 112000,
    uploader: "sports_central",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e95",
    videotitle: "Chill Lo-Fi Beats & Acoustic Live Session",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "980KB",
    videochanel: "Music Station",
    category: "Music",
    Like: 5410,
    views: 230000,
    uploader: "music_pro",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e96",
    videotitle: "Blockbuster Movie Official Trailer 2026",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.4MB",
    videochanel: "Cinema World",
    category: "Movies",
    Like: 4120,
    views: 175000,
    uploader: "cinema_club",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e97",
    videotitle: "Hilarious Tech Parodies & Standup Comedy Special",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "910KB",
    videochanel: "Comedy Central",
    category: "Comedy",
    Like: 3100,
    views: 94000,
    uploader: "comedy_king",
    createdAt: new Date(Date.now() - 691200000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e98",
    videotitle: "Quantum Computing & Universe Science Discoveries",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.3MB",
    videochanel: "Science Lab",
    category: "Science",
    Like: 2750,
    views: 81000,
    uploader: "sci_expert",
    createdAt: new Date(Date.now() - 777600000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7e99",
    videotitle: "Top 10 Hidden Island Travel Destinations Vlogs",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.6MB",
    videochanel: "Traveler Vlogs",
    category: "Travel",
    Like: 3890,
    views: 142000,
    uploader: "globetrotter",
    createdAt: new Date(Date.now() - 864000000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea0",
    videotitle: "MasterChef Cooking Secrets: Perfect Italian Pasta",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.1MB",
    videochanel: "Gourmet Kitchen",
    category: "Food",
    Like: 4500,
    views: 198000,
    uploader: "chef_gourmet",
    createdAt: new Date(Date.now() - 950400000).toISOString(),
  },
  {
    _id: "667a4d8f1e2f3a4b5c6d7ea1",
    videotitle: "Spring Streetwear Fashion Trends & Style Lookbook",
    filename: "2025-06-25T06-09-29.296Z-vdo.mp4",
    filetype: "video/mp4",
    filepath: "uploads/2025-06-25T06-09-29.296Z-vdo.mp4",
    filesize: "1.2MB",
    videochanel: "Style & Fashion",
    category: "Fashion",
    Like: 2900,
    views: 86000,
    uploader: "fashion_icon",
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
  },
];

export { CATEGORY_CATALOG };

export const getallvideo = async (req, res) => {
  try {
    let files = await video.find();
    if (!files || files.length === 0) {
      try {
        await video.insertMany(CATEGORY_CATALOG, { ordered: false });
        files = await video.find();
      } catch (insertErr) {
        console.error("Auto-seed catalog notice:", insertErr.message);
      }
      if (!files || files.length === 0) {
        return res.status(200).json(CATEGORY_CATALOG);
      }
    }
    return res.status(200).send(files);
  } catch (error) {
    console.error(" error:", error);
    return res.status(200).json(CATEGORY_CATALOG);
  }
};
