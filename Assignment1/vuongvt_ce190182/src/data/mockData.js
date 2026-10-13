export const initialCategories = [
    { id: 1, name: "Technology", image: "images/p1.jpg", quantity: 15, status: 1 },
    { id: 2, name: "Business", image: "images/p2.jpg", quantity: 23, status: 1 },
    { id: 3, name: "Sports", image: "images/p3.jpg", quantity: 8, status: 0 },
    { id: 4, name: "Entertainment", image: "images/p4.jpg", quantity: 12, status: 1 },
];

export const initialNews = [
    {
        id: 101,
        title: "React 19 Released with New Features",
        content: "Detailed overview of new features in React 19...",
        categoryId: 1,
        createdBy: "Admin",
        status: 1,
    },
    {
        id: 102,
        title: "Global Stock Market Updates",
        content: "Financial analysis for Q3...",
        categoryId: 2,
        createdBy: "Staff1",
        status: 1,
    },
];

export const initialUsers = [
    { id: 1, username: "Admin", password: "Admin", role: 1, status: 1 }, // role 1: Admin
    { id: 2, username: "Staff1", password: "Staff1", role: 2, status: 1 }, // role 2: Staff
];