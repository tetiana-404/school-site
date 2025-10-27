import React, { useEffect, useState, useCallback } from 'react';

const HomeAboutSection = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subText, setSubText] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home_about`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
        setSubText(data.subText || '');
        setLoading(false);
        setOriginalData(data);
      })
      .catch(err => {
      console.error('Помилка завантаження:', err);
      setLoading(false); // ← навіть у catch
    });
  }, []);

  const saveData = async () => {
     await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home_about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subText }),
    })
      .then(res => {
        if (res.ok) {
          setMessage('✅ Збережено');
          setTimeout(() => setMessage(''), 2000);
          setEditMode(false);
        }
      });
  };

  const cancelData = () => {
    // Повертаємось до старих даних
    if (originalData) {
      setTitle(originalData.title || "");
      setContent(originalData.content || "");
      setSubText(originalData.subText || "");
    }
    setEditMode(false);
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <section id="about" className="py-5 mt-3 bg-light">
      <div className="container">
        
        {message && <div className="alert alert-success">{message}</div>}
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            {user?.role === "admin" && !editMode ? (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-warning text-uppercase mb-0">
                  Наша гімназія
                </h6>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditMode(true)}>
                  ✏️
                </button>
              </div>
            ) : (
              <h6 className="text-warning text-uppercase mb-3">
              Наша гімназія
              </h6>
            )}

            {editMode ? (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Заголовок"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
               
                <textarea
                  className="form-control mb-3"
                  placeholder="Довгий текст"
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Короткий текст"
                  rows="3"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                />
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-outline-success  btn-lg w-50" onClick={saveData}>💾 Зберегти</button>
                  <button className="btn btn-outline-warning  btn-lg w-50" onClick={cancelData}>❌ Скасувати</button>
                </div>
              </>
            ) : (
              <>
                 
                <h2 className="mb-4 fw-bold">{title}</h2>
                <div
                  className="mb-3 text-secondary"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <p className="mb-4 fw-semibold">{subText}</p>
              </>
            )}

            <div className="d-flex align-items-center">
              <a href="#more" className="btn btn-warning me-3 px-4">Детальніше</a>
              <a href="#contacts" className="text-warning text-decoration-none">
                <i className="icofont-caret-right me-1"></i>Контакти
              </a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="position-relative rounded overflow-hidden shadow">
              <img src={process.env.PUBLIC_URL + "/img/12.jpg"} alt="Про нас" className="img-fluid w-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutSection;
