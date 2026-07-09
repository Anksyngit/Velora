import velora from './Velora.svg'
import sample_cover from './sample_cover.jpg'
import sample_profile from './sample_profile.jpg'
import bgImage from './bgImage.png'
import group_users from './group_users.png'
import { Home, MessageCircle, Search, UserIcon, Users } from 'lucide-react'
import sponsored_img from './sponsored_img.png'

export const assets = {
    velora,
    sample_cover,
    sample_profile,
    bgImage,
    group_users,
    sponsored_img
}

export const menuItemsData = [
    { to: '/', label: 'Feed', Icon: Home },
    { to: '/messages', label: 'Messages', Icon: MessageCircle },
    { to: '/connections', label: 'Connections', Icon: Users },
    { to: '/discover', label: 'Discover', Icon: Search },
    { to: '/profile', label: 'Profile', Icon: UserIcon },
];

export const dummyUserData = {
    "_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
    "email": "admin@example.com",
    "full_name": "Kushal Gupta",
    "username": "Kushal_Gupta",
    "bio": "🌍 Dreamer | Singer | 🚀 Doer\r\nExploring life one step at a time.\r\n✨ Staying curious. Creating with purpose.",
    "profile_picture": "https://res.cloudinary.com/durg2oldn/image/upload/WhatsApp_Image_2025-11-16_at_2.28.30_PM_ucjc5p.jpg",
    "cover_photo": sample_cover,
    "location": "Delhi, INDIA",
    "followers": ["user_2", "user_3","user_4"],
    "following": ["user_2", "user_3","user_4"],
    "connections": ["user_2", "user_3","user_4"],
    "posts": [],
    "is_verified": true,
    "createdAt": "2025-07-09T09:26:59.231Z",
    "updatedAt": "2025-07-21T06:56:50.017Z",
}

const dummyUser2Data = {
    ...dummyUserData,
    _id: "user_2",
    username: "Kartik Duggu",
    full_name: "Kartik Duggal",
    profile_picture: "https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-23_100619_ikyv37.png",
}

const dummyUser3Data = {
    ...dummyUserData,
    _id: "user_3",
    username: "Prathum_pingu",
    full_name: "Prathum Longia",
    profile_picture: "https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-23_100556_nvrhgp.png",
}

const dummyUser4Data = {
    ...dummyUserData,
    _id: "user_4",
    username: "Anirudh mithu",
    full_name: "Anirudh Bansal",
    profile_picture: "https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-23_100505_a5pw9z.png",
}

export const dummyStoriesData = [
    {
        "_id": "68833d466e4b42b685068860",
        "user": dummyUserData,
        "content": "📌 This isn't the story I wanted to tell… not yet. But if you're reading this, know that something interesting is in motion 🔄. The next post will make more sense 🧩.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#4f46e5",
        "createdAt": "2026-02-26T08:16:06.958Z",
        "updatedAt": "2026-03-19T08:16:06.958Z",
    },
    {
        "_id": "688340046e4b42b685068a73",
        "user": dummyUserData,
        "content": "It’s just me and my game against the world.",
        "media_url": "https://res.cloudinary.com/durg2oldn/video/upload/VID-20241002-WA0018_limpze.mp4",
        "media_type": "video",
        "background_color": "#4f46e5",
        "createdAt": "2026-03-18T08:27:48.134Z",
        "updatedAt": "2025-07-25T08:27:48.134Z",
    },
    {
        "_id": "68833fe96e4b42b685068a5e",
        "user": dummyUserData,
        "content": "",
        "media_url": "https://res.cloudinary.com/durg2oldn/video/upload/VID-20250303-WA0027_rnsppg.mp4",
        "media_type": "video",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:27:21.289Z",
        "updatedAt": "2025-07-25T08:27:21.289Z",
    },
    {
        "_id": "68833e136e4b42b685068937",
        "user": dummyUserData,
        "content": "",
        "media_url": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "media_type": "image",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:19:31.080Z",
        "updatedAt": "2025-07-25T08:19:31.080Z",
    },
    {
        "_id": "68833d706e4b42b685068875",
        "user": dummyUserData,
        "content": "🤫 Not every moment needs to be loud. Sometimes, the best things happen in silence — in drafts 📝, in progress 🧪, in planning 📊. That's where I am right now.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:16:48.617Z",
        "updatedAt": "2025-07-25T08:16:48.617Z",
    },
    {
        "_id": "68833c9e6e4b42b6850687e7",
        "user": dummyUserData,
        "content": "✨ Something meaningful is on the way. I'm working behind the scenes 🛠️ to bring it all together. This space is just the beginning 🌱. Stay tuned 👀.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:13:18.111Z",
        "updatedAt": "2025-07-25T08:13:18.111Z",
    }
]


export const dummyPostsData = [
    // 🔥 YOUR POSTS (KUSHAL)
    {
        _id: "post_1",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "Took a day off to Manali, and I still can’t believe how beautiful it is 😍",
        image_urls: [
            "https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2025-02-22_102242_hzjtfx.png"
        ],
    },
    {
        _id: "post_6",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "Unlock your potential—every small step counts. 🌱✨",
        image_urls: [],
    },
    {
        _id: "post_7",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "This is a sample paragraph with some #hashtags 🚀",
        image_urls: [],
    },
    {
        _id: "post_8",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "Artist | And The Art 🎨",
        image_urls: [
            "https://res.cloudinary.com/durg2oldn/image/upload/IMG_2744_ymccld.jpg"
        ],
    },
    {
        _id: "post_9",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "Strumming Through The Life! 🎸",
        image_urls: [
            "https://res.cloudinary.com/durg2oldn/image/upload/WhatsApp_Image_2025-05-02_at_11.28.04_oezhsx.jpg"
        ],
    },
    {
        _id: "post_10",
        user_id: "user_2zdFoZib5lNr614LgkONdD8WG32",
        content: "Hello everyone, this is my first post 👋",
        image_urls: [],
    },

    // 🔥 OTHER USERS
    {
        _id: "post_2",
        user_id: "user_2",
        content: "Life lately 🌿",
        image_urls: ['https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-26_092045_dpys9b.png'],
    },
    {
        _id: "post_3",
        user_id: "user_3",
        content: "Gym grind never stops 💪",
        image_urls: ['https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-26_092223_igeive.png'],
    },
    {
        _id: "post_4",
        user_id: "user_4",
        content: "Mehndi Vibes|| Di ki Shaadi",
        image_urls: ['https://res.cloudinary.com/durg2oldn/image/upload/Screenshot_2026-03-26_091947_x1rgam.png'],
    },
    {
        _id: "post_5",
        user_id: "user_2",
        content: "Exploring new places ✈️",
        image_urls: [
            "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"
        ],
    },
]

export const dummyRecentMessagesData = [
    {
        "_id": "68833af618623d2de81b5381",
        "from_user_id": dummyUser2Data,
        "to_user_id": dummyUserData,
        "text": "I seen your profile",
        "message_type": "text",
        "media_url": "",
        "seen": true,
        "createdAt": "2025-07-25T08:06:14.436Z",
        "updatedAt": "2025-07-25T08:47:47.768Z",
    },
    {
        "_id": "6878cc3c17a54e4d3748012f",
        "from_user_id": dummyUserData,
        "to_user_id": dummyUserData,
        "text": "This is a Samsung Tablet",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-17T10:11:08.437Z",
        "updatedAt": "2025-07-25T08:07:11.893Z",
        "seen": true
    },
    {
        "_id": "686fb66c7f0dcbff63b239e7",
        "from_user_id": dummyUser3Data,
        "to_user_id": dummyUserData,
        "text": "how are you",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-10T12:47:40.510Z",
        "updatedAt": "2025-07-10T12:47:40.510Z",
        "seen": false
    }
]

export const dummyMessagesData = [
    {
        "_id": "6878cc3217a54e4d37480122",
        "from_user_id": "user_2zwZSCMRXQ9GaEEVLgm6akQo96i",
        "to_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "text": "",
        "message_type": "image",
        "media_url": "https://images.pexels.com/photos/106341/pexels-photo-106341.jpeg",
        "createdAt": "2025-07-17T10:10:58.524Z",
        "updatedAt": "2025-07-25T10:43:50.346Z",
        "seen": true
    },
    {
        "_id": "6878cc3c17a54e4d3748012f",
        "from_user_id": "user_2zwZSCMRXQ9GaEEVLgm6akQo96i",
        "to_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "text": "Hie There",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-17T10:11:08.437Z",
        "updatedAt": "2025-07-25T10:43:50.346Z",
        "seen": true
    },
    {
        "_id": "68835ffc6e4b42b685069def",
        "from_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "to_user_id": "user_2zwZSCMRXQ9GaEEVLgm6akQo96i",
        "text": "Hello Brothur",
        "message_type": "text",
        "media_url": "",
        "seen": false,
        "createdAt": "2025-07-25T10:44:12.753Z",
        "updatedAt": "2025-07-25T10:44:12.753Z",
    },
        {
        "_id": "6878cc2817a54e4d3748010c",
        "from_user_id": "user_2zdFoZib5lNr614LgkONdD8WG32",
        "to_user_id": "user_2zwZSCMRXQ9GaEEVLgm6akQo96i",
        "text": "are you willing to come to the college right now?",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-08-17T10:10:48.956Z",
        "updatedAt": "2025-08-25T10:43:50.346Z",
        "seen": true
    },
]

export const dummyConnectionsData = [
    dummyUserData,
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
]

export const dummyFollowersData = [
    dummyUser2Data,
    dummyUser3Data
]

export const dummyFollowingData = [
    dummyUser2Data,
    dummyUser3Data
]

export const dummyPendingConnectionsData = [
    dummyUserData
]

export const allDummyUsers = [
    dummyUserData,
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data
]