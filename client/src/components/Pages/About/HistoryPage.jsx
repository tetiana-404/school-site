import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const HistoryPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [history, setHistory] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/history`);
                const data = await res.json();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };

        fetchHistory();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/history`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Історія гімназії',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="historyPage" className="section-padding1 bg-light">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{backgroundImage:  `url(${process.env.PUBLIC_URL + '/img/bg/history.jpg'})`}}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2 
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                        Історія гімназії</h2>
                                <div 
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p>1968 - {new Date().getFullYear()}</p>
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
                                    content={history?.content || ""}
                                    setContent={(newContent) => setHistory(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про історію гімназії"
                                />

                                <div className="fixed-bottom-actions text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg"
                                        onClick={() =>
                                            handleSave('/api/history', 'PUT', { content: history?.content }, () => setEditMode(false))
                                        }
                                    >
                                        <span>💾 Зберегти</span>
                                        
                                    </button>
                                    <button className="btn btn-outline-warning btn-lg" onClick={() => setEditMode(false)}>
                                        <span>❌ Скасувати</span>
                                        
                                    </button>
                                </div>
                                
                            </>
                        ) : (
                            <div className='position-relative'>
                                    {user?.role === 'admin' && !editMode && (
                                        <button
                                            className="btn btn-outline-dark position-absolute m-0 w-auto"
                                            style={{ top: "-50px", right:0 }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                <div dangerouslySetInnerHTML={{ __html: history?.content || "" }} />
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

export default HistoryPage;
