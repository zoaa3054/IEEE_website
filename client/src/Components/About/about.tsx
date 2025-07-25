import React from 'react';
import './about.css';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children, className }) => (
  <div className={className}>
    <h2>{title}</h2>
    <p>{children}</p>
  </div>
);

interface IconInfoProps {
  icon: string;
  title: string;
  text: string;
}

const IconInfo: React.FC<IconInfoProps> = ({ icon, title, text }) => (
  <div className="icon-info-item">
    <div className="icon-container">
    <span className="icon-placeholder">{icon}</span>
    </div>
    <div className="icon-info-text">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </div>
);

interface AchievementItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ icon, title, description }) => (
  <div className="achievement-item">
    <div className="achievement-icon">{icon}</div>
    <div className="achievement-text">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

  const achievements = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
        title: '12 Years',
        description: '12 years of commitment and growth'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.5 5.162a1 1 0 0 0-1.002 0L2.598 9.084a1 1 0 0 0-.02 1.838l8.9 3.92a1 1 0 0 0 .998-.001l8.945-3.92z"></path><path d="M4.21 12.556v3.31a1 1 0 0 0 .513.874l6.784 3.917a1 1 0 0 0 .998 0l6.784-3.917a1 1 0 0 0 .513-.874v-3.31"></path></svg>,
        title: '+1000 Alumni',
        description: 'Over 1000 Alumni who have been part of our journey'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
        title: '+2500 Hours',
        description: 'Over 2,500 hours of training and hands-on experience'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        title: '+100 Activities',
        description: 'Interactive activities done for learning and growth'
    }
  ];


// MY SWEET STORAGE SAVER
const AboutPage: React.FC = () => {
  const partners = [
    { name: 'Siemens Healthineers', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Siemens_Healthineers_logo.svg' },
    { name: 'Eventum Solutions', logo: 'https://cdn.prod.website-files.com/665832f713e86b4a425d7531/6669a235fc73de73cd977740_New%20Logo%20Horizontal-p-500.png' },
    { name: 'Valeo', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Valeo_Logo.svg' },
    { name: 'VSLI EGYPT', logo: 'https://media-exp1.licdn.com/dms/image/C560BAQH_mkyu88X_lA/company-logo_200_200/0/1519876245645?e=2159024400&v=beta&t=xhuU_hRa2mfVT649fSDxITHh0n3UoJpTQlyNKnKmFc8' },
    { name: 'IEEE Egypt Section', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1200px-IEEE_logo.svg.png' },
    { name: 'Cpedia', logo: 'https://images.wuzzuf-data.net/files/company_logo/ICpedia-Egypt-35379-1535892735.jpg' },
    { name: 'Si-Ware Systems', logo: 'https://assets.website-files.com/627d6c777a174b62cad95c20/627d6c777a174b78a2d95cbe_logo_Neospectra_BySiWare_all_color_transp_RGB-1200x300-p-500.jpeg' },
    { name: 'Si-Vision', logo: 'https://tse3.mm.bing.net/th/id/OIP.DU6PaznUBTDGW6FF-4e9EwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cisco_logo.svg/1200px-Cisco_logo.svg.png' },
    { name: 'Nile University', logo: 'https://images.wuzzuf-data.net/files/company_logo/Nile-University-Egypt-25186-1497357925-og.png' },
    { name: 'ITIDA', logo: 'https://www.itida.gov.eg/Style%20Library/LINKDev/Img/itidaLogo.jpg' },
    { name: 'Microsoft Research', logo: 'https://www.isis.vanderbilt.edu/sites/isis.vanderbilt.edu/files/styles/large/public/2021-09/Microsoft-Research-logo.png?itok=-YBqnR9T' },
    { name: 'Vodafone', logo: 'https://tse2.mm.bing.net/th/id/OIP.G4MHhuNAZfuIe-kxP4OnHAHaDk?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'NTRA', logo: 'https://www.crwflags.com/fotw/images/e/eg_ntra.jpg' },
  ];

  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About</h1>
        <div className="header-logos">
           <span>Part of: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1200px-IEEE_logo.svg.png" alt="IEEE Power Electronics Society" /></span>
           <span>Powered of: <img src="https://tse4.mm.bing.net/th/id/OIP.fMPG9N5S9jchAbMdM39iIAHaFo?rs=1&pid=ImgDetMain&o=7&rm=3g" alt="PST" /></span>
           <span>Backed of: <img src="https://itida.gov.eg/PublishingImages/eme-logo.jfif" alt="EME" /></span>
        </div>
      </header>

      <main>
        {/* IEEE Section */}
        <section className="info-card-section">
          <div className="info-card-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1200px-IEEE_logo.svg.png" alt="IEEE Logo" />
          </div>
          <div className="info-card-content">
            <InfoSection title="IEEE" className="info-column">
              The IEEE is the world's largest technical organization, with 400,000+ members in over 160 countries. It advances technology through research, standards, conferences, education, and networking, supporting innovation to solve global challenges.
              <a href="https://www.ieee.org/" target="_blank" rel="noopener noreferrer">https://www.ieee.org/</a>
            </InfoSection>
            <InfoSection title="IEEE AlexSB" className="info-column">
              The IEEE Alexandria University Student Branch, one of the largest in IEEE Region 8 since 2000, part of the IEEE Egypt Section with 500+ Volunteers.
              <a href="https://www.alexsb.org/" target="_blank" rel="noopener noreferrer">https://www.alexsb.org/</a>
            </InfoSection>
          </div>
        </section>

        {/* SSCS Section */}
        <section className="info-card-section sscs-section">
          <div className="info-card-logo">
            <img src="./SSCS-Full-Logo.png" alt="SSCS Logo" />
          </div>
          <div className="info-card-content">
            <InfoSection title="SSCS" className="info-column">
              The IEEE Solid-State Circuits Society (SSCS) advances the design and application of solid-state circuits, including analog, digital, RF, and VLSI technologies. It connects professionals and students worldwide through top publications, flagship conferences like ISSCC, and programs that promote innovation and learning.
              <a href="https://sscs.ieee.org/" target="_blank" rel="noopener noreferrer">https://sscs.ieee.org/</a>
            </InfoSection>
            <InfoSection title="SSCS AlexSBC" className="info-column">
              The SSCS Alexandria University Student Branch Chapter, 1st in MENA and MEA Region, part of the IEEE AlexSB since 2012 with 200+ independent Volunteers.
              <a href="https://sscsalex.org/" target="_blank" rel="noopener noreferrer">https://sscsalex.org/</a>
            </InfoSection>
          </div>
        </section>

        {/* Vision, Mission, Objective Section */}
        <section className="vmo-section">
          <IconInfo icon="💡" title="Vision" text="Cultivating next generation of leaders and pioneers in the semiconductors industry" />
          <IconInfo icon="🎯" title="Mission" text="Building a supportive ecosystem that equips youth with the knowledge, skills, and opportunities needed to excel through education and industry engagement" />
          <IconInfo icon="📝" title="Objective" text="Spread awareness about the semiconductor industry. Train students with hands-on skills and industry insights. Empower talents by capitalizing leadership and innovation." />
        </section>

        {/* Strategy Section */}
        <section className="strategy-section">
          <div className="strategy-header">
             <span className="icon-placeholder">🔗</span>
             <h2>Strategy</h2>
          </div>
          <div className="strategy-bubbles">
            <div className="bubble">Aware</div>
            <div className="bubble">Educate</div>
            <div className="bubble">Empower</div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="activities-section">
            <InfoSection title="Activities">
              SSCS AlexSBC organizes a variety of oncampus seminars, targeted towards raising the awareness of engineering students, where several technical and non-technical fields are discussed.
            </InfoSection>
             <InfoSection title="Activities">
             Visits: SSCS AlexSBC organizes a variety of oncampus seminars, targeted towards raising the awareness of engineering students, where several technical and non-technical fields are discussed.
            </InfoSection>
        </section>

        {/* Chipions Section */}
        <section className="chipions-section">
            <img src="https://sscsalex.org/static/b22b29295f6525ebad6eb60b224f3ec7/2a4de/chipions.png" alt="Chipions Logo" className="chipions-logo"/>
            <h3>Chipions</h3>
            <p>Launched in 2015, Chipions was one of Egypt's few digital design training programs and the first in Alexandria, training over 1,000 participants in the full VLSI design flow.</p>
        </section>

        {/* Achievement Section */}
        <section className="achievement-section">
            <h2>Achievement</h2>
            <div className="achievement-grid">
                {achievements.map((item, index) => (
                    <AchievementItem key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
            </div>
        </section>

        {/* Partners Section */}
        <section className="partners-section">
            <h2>Old Partners</h2>
            <div className="partners-grid">
                {partners.map(partner => (
                    <div key={partner.name} className="partner-logo">
                        <img src={partner.logo} alt={`${partner.name} logo`} onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x70/ffffff/cccccc?text=Logo+Not+Found'; }} />
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
