import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

const TeamSection = ({ user }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/team-members`)
      .then(res => res.json())
      .then(data => setTeamMembers(data));
  }, []);

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const newUrl = data.url;

      const updated = [...teamMembers];
      updated[index].img = newUrl;
      setTeamMembers(updated);

      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/team-members/${updated[index].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated[index]),
      });
    } catch (err) {
      console.error('❌ Upload image failed:', err);
    }
  };

  const addNewMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now(), name: '', position: '', img: '' }]);
  };

  const deleteMember = (index) => {
    const updated = [...teamMembers];
    updated.splice(index, 1);
    setTeamMembers(updated);
  };

  const saveChanges = async () => {
    try {
      await Promise.all(
        teamMembers.map(member =>
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/team-members/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
          })
        )
      );
      setEditMode(false);
    } catch (err) {
      console.error('❌ Failed to save changes:', err);
    }
  };

  const cancelChanges = () => window.location.reload();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="team" className="section-padding py-5 position-relative">
      <div className="auto-container">
        <div className="row position-relative">
          <div className="col-lg-7 col-md-7 col-12 mx-auto text-center position-relative">
            <div className="section-title">
              <h6 className="text-success mb-2">Навчаємо з любов'ю</h6>
              <h2 className="fw-bold mb-3">Наші вчителі</h2>
              <p className="py-3">Натхненні професіонали, які ведуть дітей до успіху.</p>
            </div>
            
          </div>
          {user?.role === 'admin' && !editMode && (
              <button
                className="btn btn-outline-dark position-absolute bottom-0 m-3 w-auto" style={{right:20}}
                onClick={() => setEditMode(true)}
              >
                ✏️
              </button>
            )}
        </div>

        <div className="row mb-5">
          <div className="col">
            <div className="team-carousel-section">
              <Slider {...settings}>
                {teamMembers.map((member, i) => (
                  <div key={member.id || i} className="owl-item" style={{ width: 226, marginRight: 30 }}>
                    <div className="single-team-wrapper p-3 text-center">
                      <div className="single-team-member">
                        <img
                          className="img-fluid"
                          src={member.img || '/img/no-photo.jpg'}
                          alt={member.name}
                          style={{ height:'300px', objectFit: 'cover', width: '100%' }}
                        />
                        <div className="single-team-member-content">
                          {editMode ? (
                            <>
                              <input
                                value={member.name}
                                onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                                className="form-control mb-1"
                                placeholder="Ім’я"
                              />
                              <input
                                value={member.position}
                                onChange={(e) => handleMemberChange(i, 'position', e.target.value)}
                                className="form-control mb-1"
                                placeholder="Посада"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, i)}
                                className="form-control mb-1"
                              />
                              <button
                                className="btn btn-sm btn-outline-danger mt-2"
                                onClick={() => deleteMember(i)}
                              >
                                🗑️ Видалити
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="single-team-member-social list-inline mb-2">
                                <p><a>{member.position}</a></p>
                              </div>
                              <div className="single-team-member-text">
                                <h4>{member.name}</h4>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="text-center">
            <button className="btn btn-outline-primary me-2" onClick={addNewMember}>➕ Додати викладача</button>
            <button className="btn btn-success me-2" onClick={saveChanges}>💾 Зберегти</button>
            <button className="btn btn-secondary" onClick={cancelChanges}>❌ Скасувати</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
