import { useState } from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [expandedFaq, setExpandedFaq] = useState({});

  const toggleFaq = (id) => {
    setExpandedFaq(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>FORWARD</h1>
        <h2 className={styles.subtitle}>Summer Accelerator</h2>
        <p className={styles.description}>
          Forward is all about taking action on your startup idea. We focus on engaging with potential customers in the very beginning.
          Our Summer Accelerator gives you the freedom to fail and validate your startup idea. You will be guided by the top-notch coaches of the startup world.
        </p>
        <button className={styles.applyButton} onClick={() => {
    window.location.href = "https://form.typeform.com/to/erOWKmxZ?typeform-source=www.forwardbylutes.fi";
  }}>Apply here!</button>
      </div>

      {/* Program Highlights */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Forward Accelerator starts 12th of May</h2>
        <p>You'll get concrete tools to create world-changing startups, a wide network of people and an awesome summertime in Lappeenranta.</p>
        <ul className={styles.list}>
          <li>Totally free program</li>
          <li>Exclusive mentors, speakers and advisors</li>
          <li>10-week intensive program</li>
        </ul>
      </div>

      {/* Requirements & Benefits */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>What You Need</h3>
          <ul className={styles.list}>
            <li>10 weeks of free calendar from 12th of May to 20th of July</li>
            <li>Open mindset towards problem solving</li>
            <li>Full-time commitment (no summer jobs)</li>
            <li>Physical presence in Lappeenranta</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>What You Get</h3>
          <ul className={styles.list}>
            <li>Personal grant worth of 1500 €</li>
            <li>6 credits (ECTS)</li>
            <li>Free accommodation if you come outside Lappeenranta</li>
            <li>Top-notch coaching and mentorship</li>
          </ul>
        </div>
      </div>

      {/* Program FAQ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Program Details</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem} onClick={() => toggleFaq('free')}>
            <h3 className={styles.faqQuestion}>Is it free to participate?</h3>
            {expandedFaq['free'] && <p className={styles.faqAnswer}>Yes, it's totally free.</p>}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('weekProgram')}>
            <h3 className={styles.faqQuestion}>What is the week program like?</h3>
            {expandedFaq['weekProgram'] && (
              <p className={styles.faqAnswer}>
                Every week consists of 2-4 workshops, at least one community evening and plenty of time to work on your idea without interruptions.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('workload')}>
            <h3 className={styles.faqQuestion}>What is the workload weekly?</h3>
            {expandedFaq['workload'] && (
              <p className={styles.faqAnswer}>
                The working days are from Monday to Friday around 6-8 hours a day. Weekends are free.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('lateStart')}>
            <h3 className={styles.faqQuestion}>Can I start after 12th of May?</h3>
            {expandedFaq['lateStart'] && (
              <p className={styles.faqAnswer}>
                Preferably not because we have other full time committing participants.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('remote')}>
            <h3 className={styles.faqQuestion}>Can I participate remotely?</h3>
            {expandedFaq['remote'] && (
              <p className={styles.faqAnswer}>
                No. The whole program is organised on LUT University in Lappeenranta from Monday to Friday for 10 weeks.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('summerJob')}>
            <h3 className={styles.faqQuestion}>Can I have summer job during the program?</h3>
            {expandedFaq['summerJob'] && (
              <p className={styles.faqAnswer}>
                No, we hope you to fully commit to the program. The program is time consuming and demanding.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('language')}>
            <h3 className={styles.faqQuestion}>Is English the main language?</h3>
            {expandedFaq['language'] && (
              <p className={styles.faqAnswer}>
                Yes. All the workshops and trainings are in English.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Support FAQ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Support for Participants</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem} onClick={() => toggleFaq('financial')}>
            <h3 className={styles.faqQuestion}>Do I get financial support?</h3>
            {expandedFaq['financial'] && (
              <p className={styles.faqAnswer}>
                Yes, every participant gets personal grant of 1500 €.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('credits')}>
            <h3 className={styles.faqQuestion}>Do I get study credits?</h3>
            {expandedFaq['credits'] && <p className={styles.faqAnswer}>6 ECTS</p>}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('housing')}>
            <h3 className={styles.faqQuestion}>Do you provide housing if I'm outside Lappeenranta?</h3>
            {expandedFaq['housing'] && (
              <p className={styles.faqAnswer}>
                Yes, we have option for free shared housing through LOAS.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Application FAQ */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Application Questions</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem} onClick={() => toggleFaq('deadline')}>
            <h3 className={styles.faqQuestion}>When is the application period ending?</h3>
            {expandedFaq['deadline'] && <p className={styles.faqAnswer}>15th of March.</p>}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('applyAlone')}>
            <h3 className={styles.faqQuestion}>Can I apply alone?</h3>
            {expandedFaq['applyAlone'] && (
              <p className={styles.faqAnswer}>
                Yes, but we encourage you to find a team member before the program starts to get the most out of the program. We can help you to find a teammate.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('equity')}>
            <h3 className={styles.faqQuestion}>Does Forward take equity from my company?</h3>
            {expandedFaq['equity'] && <p className={styles.faqAnswer}>No.</p>}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('noIdea')}>
            <h3 className={styles.faqQuestion}>Can I apply without an idea?</h3>
            {expandedFaq['noIdea'] && (
              <p className={styles.faqAnswer}>
                Absolutely yes, you'll need to have passion to come up with an idea before the start. We can also help you with finding a good idea.
              </p>
            )}
          </div>

          <div className={styles.faqItem} onClick={() => toggleFaq('student')}>
            <h3 className={styles.faqQuestion}>Do I have to be a student?</h3>
            {expandedFaq['student'] && (
              <p className={styles.faqAnswer}>
                No, Forward is mostly for higher education students but anyone can apply.
              </p>
            )}
          </div>
        </div>
        <button className={styles.applyButton} onClick={() => {
    window.location.href = "https://form.typeform.com/to/erOWKmxZ?typeform-source=www.forwardbylutes.fi";
  }}>Apply Now</button>
      </div>
    </div>
  );
};

export default HomePage;