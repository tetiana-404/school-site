import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Topbar from "./components/Topbar";
import Header from "./components/Header"
import Home from "./components/Home";
import Posts from "./components/Posts"
import PostDetail from "./components/PostDetail";
import EditPost from "./components/EditPost";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import NewsletterSection from "./components/HomePage/NewsletterSection";
import AboutPage from './components/Pages/About/AboutPage';
import HistoryPage from "./components/Pages/About/HistoryPage";
import DocumentsPage from "./components/Pages/About/DocumentsPage";
import AnthemPage from "./components/Pages/About/AnthemPage";
import StrategyPage from "./components/Pages/About/StrategyPage";
import ReportsPage from "./components/Pages/About/ReportsPage";
import TeachersPage from "./components/Pages/About/TeachersPage";
import RegDocumentsPage from "./components/Pages/Info/RegularDocuments";
import InternalDocumentsEditor from "./components/Pages/Info/InternalDocumentsEditor";
import AreaPage from "./components/Pages/Info/Area";
import LanguagePage from "./components/Pages/Info/Language";
import FacilitiesPage from "./components/Pages/Info/Facilities";
import ServicesPage from "./components/Pages/Info/Services";
import FamilyEducationEditor from "./components/Pages/Info/FamilyEducation";
import RulesPage from "./components/Pages/Info/Rules";
import InstructionsPage from "./components/Pages/Info/Instructions";
import BullingEditor from "./components/Pages/Info/Bullying";
import ProgramsEditor from "./components/Pages/Info/Programs";
import CertificationsEditor from "./components/Pages/Info/Certifications";
import CriteriaEditor from "./components/Pages/Info/Criteria";
import WorkPlanPage from "./components/Pages/About/WorkPlanPage";

import SchoolRating from "./components/Pages/Achievements/SchoolRating";
import SchoolMedals from "./components/Pages/Achievements/SchoolMedals";
import SchoolWinners from "./components/Pages/Achievements/SchoolWiners";
import SchoolBells from "./components/Pages/ForParents/SchoolBells";
import SchoolTimetable from "./components/Pages/ForParents/SchoolTimetable";
import SchoolClubsTimetable from "./components/Pages/ForParents/SchoolClubsTimetable";
import DonationsPage from "./components/Pages/ForParents/DonationsPage";

import AdmissionPage from "./components/Pages/AdmissionPage";
import FinancePage from "./components/Pages/FinancePage";
import ContactPage from "./components/Pages/ContactPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./App.css"; 

const App = () => {
   const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <BrowserRouter basename="/school-site">
      <Topbar user={user} setUser={setUser} />
      <Header />
      
      <main>
      {/* Контент */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} /> 
        <Route path="/edit/:id" element={<EditPost />} />

        <Route path="/about" element={<AboutPage user={user} />} />
        <Route path="/history" element={<HistoryPage user={user} />} />
        <Route path="/anthem" element={<AnthemPage user={user} />} />
        <Route path="/documents" element={<DocumentsPage user={user} />} />
        <Route path="/strategy" element={<StrategyPage user={user} />} />
        <Route path="/work-plan" element={<WorkPlanPage user={user} />} />
        <Route path="/reports" element={<ReportsPage user={user} />} />
        <Route path="/teachers" element={<TeachersPage user={user} />} />
        <Route path="/reg-documents" element={<RegDocumentsPage user={user} />} />
        <Route path="/internal-documents/all" element={<InternalDocumentsEditor user={user} />} />
        <Route path="/area" element={<AreaPage user={user}/>}  />
        <Route path="/language" element={<LanguagePage user={user}/>}  />
        <Route path="/facilities" element={<FacilitiesPage user={user} />} />
        <Route path="/services" element={<ServicesPage user={user} />} />
        <Route path="/family-education" element={<FamilyEducationEditor user={user} />} />
        <Route path="/rules" element={<RulesPage user={user} />} />
        <Route path="/instructions" element={<InstructionsPage user={user} />} />
        <Route path="/bullying" element={<BullingEditor user={user} />} />
        <Route path="/programs" element={<ProgramsEditor user={user} />} />
        <Route path="/certifications" element={<CertificationsEditor user={user} />} />
        <Route path="/criteria" element={<CriteriaEditor user={user} />} />

        <Route path="/school-rating" element={<SchoolRating user={user} />} />
        <Route path="/school-medals" element={<SchoolMedals user={user} />} />
        <Route path="/olympiads" element={<SchoolWinners user={user} />} />
      
        <Route path="/school-timetable" element={<SchoolTimetable user={user}  />} />
        <Route path="/school-bells" element={<SchoolBells user={user}  />} />
        <Route path="/school-clubs-timetable" element={<SchoolClubsTimetable user={user}  />} />
        <Route path="/donations" element={<DonationsPage user={user}  />} />

        <Route path="/admission" element={<AdmissionPage user={user}  />} />
        <Route path="/finance" element={<FinancePage user={user}  />} />
        <Route path="/contact" element={<ContactPage user={user}  />} />
      </Routes>
      
      </main>
      <NewsletterSection />
      <Footer />
      <ScrollToTop />
     
    </BrowserRouter>
  );
};

export default App;
