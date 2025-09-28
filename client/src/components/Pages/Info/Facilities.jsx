import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";
import "../../Styles/global.css"

const FacilitiesPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [facilities, setFacilities] = useState(null);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/facilities`);
                const data = await res.json();
                setFacilities(data);
            } catch (error) {
                console.error("Failed to fetch facilities:", error);
            }
        };

        fetchFacilities();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/facilities`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Матеріально-технічне забезпечення гімназії',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="facilitiesPage" className="bg-light">
             <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/english-class.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    Матеріально-технічне забезпечення гімназії</h2>
                                <div
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="auto-container py-5">
               
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={facilities?.content || ""}
                                    setContent={(newContent) => setFacilities(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про територію обслуговування"
                                />

                                <div className="fixed-bottom-actions text-center mt-5">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/facilities', 'PUT', { content: facilities?.content }, () => setEditMode(false))
                                        }
                                    >
                                        💾 Зберегти
                                    </button>
                                    <button className="btn btn-outline-warning btn-lg w-50" onClick={() => setEditMode(false)}>❌ Скасувати</button>
                                </div>
                            </>
                        ) : (
                            <div className='position-relative  '>
                                    {user?.role === 'admin' && !editMode && (
                                        <button
                                            className="btn btn-outline-dark position-absolute m-0 w-auto"
                                            style={{ top: "-50px", right:0 }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                <div className="editor-content" dangerouslySetInnerHTML={{ __html: facilities?.content || "" }} />
                                {user?.role === 'admin' && !editMode && (
                                        <button
                                            className="btn btn-outline-dark position-absolute m-0 w-auto"
                                            style={{ bottom: "0px", right:0 }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️
                                        </button>
                                    )}
                            </div>
                        )}

                    </div>
                </div>
              

            </div>
        </section>
    );
};

export default FacilitiesPage;
