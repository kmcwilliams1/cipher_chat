import React from 'react';
import '../CSS/Profile.css';

const Progress: React.FC<{ label: string; percent: number }> = ({ label, percent }) => (
    <div className="progress-block">
        <div className="progress-label">{label}</div>
        <div className="progress">
            <div className="progress-bar" style={{ width: `${percent}%` }} aria-valuenow={percent} />
        </div>
    </div>
);

const ProfilePage: React.FC = () => {
    return (
        <section className="profile-section">
            <div className="container">
                <nav className="breadcrumb">
                    <a href="#">Home</a>
                    <span>/</span>
                    <a href="#">User</a>
                    <span>/</span>
                    <span className="active">User Profile</span>
                </nav>

                <div className="row">
                    <aside className="col col-4">
                        <div className="card">
                            <div className="card-body center">
                                <img
                                    className="avatar"
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                />
                                <div className="muted">Full Stack Developer</div>
                                <div className="muted small mb">Bay Area, San Francisco, CA</div>
                                <div className="btn-row">
                                    <button className="btn">Follow</button>
                                    <button className="btn outline">Message</button>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <span className="icon">🌐</span>
                                    <span className="link-text">https://mdbootstrap.com</span>
                                </li>
                                <li className="list-group-item">
                                    <span className="icon">🐙</span>
                                    <span className="link-text">mdbootstrap</span>
                                </li>
                                <li className="list-group-item">
                                    <span className="icon">🐦</span>
                                    <span className="link-text">@mdbootstrap</span>
                                </li>
                                <li className="list-group-item">
                                    <span className="icon">📸</span>
                                    <span className="link-text">mdbootstrap</span>
                                </li>
                                <li className="list-group-item">
                                    <span className="icon">📘</span>
                                    <span className="link-text">mdbootstrap</span>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <main className="col col-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="info-row">
                                    <div className="info-key">Full Name</div>
                                    <div className="info-val">Johnatan Smith</div>
                                </div>
                                <hr />
                                <div className="info-row">
                                    <div className="info-key">Email</div>
                                    <div className="info-val">example@example.com</div>
                                </div>
                                <hr />
                                <div className="info-row">
                                    <div className="info-key">Phone</div>
                                    <div className="info-val">(097) 234-5678</div>
                                </div>
                                <hr />
                                <div className="info-row">
                                    <div className="info-key">Mobile</div>
                                    <div className="info-val">(098) 765-4321</div>
                                </div>
                                <hr />
                                <div className="info-row">
                                    <div className="info-key">Address</div>
                                    <div className="info-val">Bay Area, San Francisco, CA</div>
                                </div>
                            </div>
                        </div>

                        <div className="row two-cols">
                            <div className="col col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="section-title"><span className="muted italic">assignment</span> Project Status</div>
                                        <Progress label="Web Design" percent={80} />
                                        <Progress label="Website Markup" percent={72} />
                                        <Progress label="One Page" percent={89} />
                                        <Progress label="Mobile Template" percent={55} />
                                        <Progress label="Backend API" percent={66} />
                                    </div>
                                </div>
                            </div>

                            <div className="col col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="section-title"><span className="muted italic">assignment</span> Project Status</div>
                                        <Progress label="Web Design" percent={80} />
                                        <Progress label="Website Markup" percent={72} />
                                        <Progress label="One Page" percent={89} />
                                        <Progress label="Mobile Template" percent={55} />
                                        <Progress label="Backend API" percent={66} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
