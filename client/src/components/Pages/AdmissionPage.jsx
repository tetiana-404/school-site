import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    CircularProgress,
    IconButton,
    Tooltip,
    List,
    ListItemButton,
    ListItemText
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import TextEditor from "../TextEditor";

const AdmissionPage = ({ user }) => {
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState("general"); // default
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    const menuItems = [
        { key: "general", label: "Загальна інформація" },
        { key: "ukr_exam", label: "Іспит з української мови" },
        { key: "math_exam", label: "Іспит з математики" },
    ];


    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admission`);
                const data = await res.json();
                setSections(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("❌ Failed to fetch admission:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const currentSection = sections.find((s) => s.section === activeSection);

    const handleSave = async () => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admission/${currentSection.section}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: currentSection.content }),
            });
            setEditMode(false);
        } catch (err) {
            console.error("Помилка збереження:", err);
        }
    };

    return (
        <Container>
            <Box display="flex" gap={4} mt={4} mb={4}>
                {/* Ліва частина (контент) */}
                <Box flex={3}>
                    {loading ? (
                        <CircularProgress />
                    ) : currentSection ? (
                        <Card sx={{ boxShadow: 3, position: "relative" }}>
                            {user?.role === "admin" && !editMode && (
                                <Tooltip title="Редагувати">
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            color: "primary.main",
                                            backgroundColor: "white",
                                            "&:hover": { backgroundColor: "#f0f0f0" },
                                        }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        <FaEdit size={20} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    gutterBottom
                                    align="center"
                                    color="primary"
                                >
                                   {menuItems.find(item => item.key === activeSection)?.label || "Розділ"}
                                </Typography>

                                {editMode ? (
                                    <>
                                        <TextEditor
                                            content={currentSection.content || ""}
                                            setContent={(newContent) =>
                                                setSections((prev) =>
                                                    prev.map((s) =>
                                                        s.id === currentSection.id ? { ...s, content: newContent } : s
                                                    )
                                                )
                                            }
                                        />
                                            <div className="fixed-bottom-actions text-center mt-5">
                                                <button
                                                    className="btn btn-outline-success btn-lg"
                                                    onClick={() =>
                                                        handleSave(
                                                            `${process.env.REACT_APP_BACKEND_URL}/api/admission/${currentSection.section}`,
                                                            "PUT",
                                                            { content: currentSection.content },
                                                            () => setEditMode(false)
                                                        )
                                                    }
                                                >
                                                    💾 Зберегти
                                                </button>

                                                <button
                                                    className="btn btn-outline-warning btn-lg"
                                                    onClick={() => setEditMode(false)}
                                                >
                                                    ❌ Скасувати
                                                </button>
                                            
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            backgroundColor: "#f9f9f9",
                                            padding: "1rem",
                                            borderRadius: "8px",
                                        }}
                                        dangerouslySetInnerHTML={{ __html: currentSection.content }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography>Секція не знайдена</Typography>
                    )}
                </Box>

                {/* Права частина (меню) */}
                <Box flex={1} sx={{ maxWidth: "300px" }}>
                   
                    <List>
                        {menuItems.map((item) => (
                            <ListItemButton
                                key={item.key}
                                selected={activeSection === item.key}
                                onClick={() => setActiveSection(item.key)}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Box>
        </Container>
    );
};

export default AdmissionPage;
