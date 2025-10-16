import React, { useState, useEffect } from 'react';

const InternalDocumentsEditor = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newDoc, setNewDoc] = useState({ title: '', file: null, isActive: true });
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const fetchInternalDocuments = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/internal-documents/all`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error('Не вдалося отримати документи:', error);
    }
  };

  useEffect(() => {
    fetchInternalDocuments();
  }, []);

  const handleFileChange = (e) => {
    setNewDoc({ ...newDoc, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newDoc.title);
    formData.append('isActive', newDoc.isActive);
    if (newDoc.file) formData.append('file', newDoc.file);

    const endpoint = editing
      ? `${process.env.REACT_APP_BACKEND_URL}/api/internal-documents/${editing.id}`
      : `${process.env.REACT_APP_BACKEND_URL}/api/internal-documents`;

    const method = editing ? 'PUT' : 'POST';

    try {
      await fetch(endpoint, {
        method,
        body: formData,
      });

      await fetchInternalDocuments();
      setNewDoc({ title: '', file: null, isActive: true });
      setEditing(null);
      setEditMode(false);
    } catch (error) {
      console.error('Не вдалося надіслати документ:', error);
    }
  };

  const handleEdit = (doc) => {
    setNewDoc({ title: doc.title, file: null, isActive: doc.isActive });
    setEditing(doc);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setNewDoc({ title: '', file: null, isActive: true });
    setEditMode(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Видалити документ?')) {
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/internal-documents/${id}`, {
          method: 'DELETE',
        });
        await fetchInternalDocuments();
      } catch (error) {
        console.error('Не вдалося видалити документ:', error);
      }
    }
  };

  return (
    <section id="regdocumentsPage" className="bg-light">
       <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/documents_02.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    Нормативні документи</h2>
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
          <div className="col-lg-12">
            
            <div className="accordion">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="accordion-item"
                  style={{
                    border: '1px solid #ccc',
                    marginBottom: '10px',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="accordion-header"
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      background: '#f5f5f5',
                    }}
                    onClick={() => toggleAccordion(doc.id)}
                  >
                    <strong>{doc.title}</strong>
                  </div>

                  {openId === doc.id && (
                    <div className="accordion-content" style={{ padding: '10px' }}>
                      <iframe
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${doc.file}`}
                        width="100%"
                        height="600px"
                        style={{ border: '1px solid #ccc', marginTop: '10px' }}
                        title={`Документ: ${doc.title}`}
                      />

                      {user?.role === 'admin' && !editMode && (
                        <div style={{ marginTop: '10px' }}>
                          <button onClick={() => handleEdit(doc)}>✏️ Редагувати</button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            style={{ marginLeft: '10px' }}
                          >
                            🗑️ Видалити
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {editMode ? (
              <>
                <h3>{editing ? 'Редагування документа' : 'Додати документ'}</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <input
                    type="text"
                    placeholder="Назва"
                    value={newDoc.title}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, title: e.target.value })
                    }
                    required
                  />
                  <button type="submit">
                    {editing ? '✏️ Оновити' : '➕ Додати'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{ marginLeft: '8px' }}
                  >
                    ❌ Вийти
                  </button>
                </form>
              </>
            ) : (
              user?.role === 'admin' && (
                <button
                  className="btn btn-outline-dark mt-3"
                  onClick={() => setEditMode(true)}
                >
                  ➕ Додати документ
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternalDocumentsEditor;
