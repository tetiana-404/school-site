import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const WorkPlanPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [workPlan, setWorkPlan] = useState(null);

    useEffect(() => {
        const fetchWorkPlan = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/work-plan`);
                const data = await res.json();
                setWorkPlan(data);
            } catch (error) {
                console.error("Failed to fetch Anthem:", error);
            }
        };

        fetchWorkPlan();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/work-plan`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Стратегія розвитку гімназії',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="workPlanPage" className="bg-light">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/plan.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    План роботи гімназії</h2>
                                <div
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p>Загальна інформація</p>
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
                                    content={workPlan?.content || ""}
                                    setContent={(newContent) => setWorkPlan(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про план роботи гімназії"
                                />

                                <div className="fixed-bottom-actions text-center mt-5">
                                    <button
                                        className="btn btn-outline-success btn-lg"
                                        onClick={() =>
                                            handleSave('/api/work-plan', 'PUT', { content: workPlan?.content }, () => setEditMode(false))
                                        }
                                    >
                                        💾 Зберегти
                                    </button>
                                    <button className="btn btn-outline-warning btn-lg" onClick={() => setEditMode(false)}>❌ Скасувати</button>
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
                                <div dangerouslySetInnerHTML={{ __html: workPlan?.content || "" }} />
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

export default WorkPlanPage;
