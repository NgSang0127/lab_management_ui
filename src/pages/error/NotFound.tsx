import React, {useEffect} from 'react';
import styles from '../../components/error/NotFound.module.css'; // Import CSS Module
import {initAstronautAnimation} from '../../components/error/visorAnimation.ts';
import {useNavigate} from 'react-router-dom';
import {Helmet} from "react-helmet-async";

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        initAstronautAnimation();
    }, []);

    return (
        <>
            <Helmet>
                <title>404 | Lab Management IT</title>
            </Helmet>
            <div className={styles.notFoundContainer}>
                <div className={styles.moon}></div>
                <div className={styles.moonCrater + ' ' + styles.moonCrater1}></div>
                <div className={styles.moonCrater + ' ' + styles.moonCrater2}></div>
                <div className={styles.moonCrater + ' ' + styles.moonCrater3}></div>

                <div className={styles.star + ' ' + styles.star1}></div>
                <div className={styles.star + ' ' + styles.star2}></div>
                <div className={styles.star + ' ' + styles.star3}></div>
                <div className={styles.star + ' ' + styles.star4}></div>
                <div className={styles.star + ' ' + styles.star5}></div>

                <div className={styles.error}>
                    <div className={styles.errorTitle}>404</div>
                    <div className={styles.errorSubtitle}>Page Not Found</div>
                    <div className={styles.errorDescription}>
                        The page you're looking for doesn't exist or has been moved.
                    </div>
                    <div className={styles.errorButtonContainer}>
                        <button className={styles.btn + ' ' + styles.orange} onClick={() => navigate("/")}>
                            Go to Home
                        </button>
                    </div>
                </div>

                <div className={styles.astronaut}>
                    <div className={styles.astronautBackpack}></div>
                    <div className={styles.astronautBody}></div>
                    <div className={styles.astronautBodyChest}></div>
                    <div className={styles.astronautArmLeft1}></div>
                    <div className={styles.astronautArmLeft2}></div>
                    <div className={styles.astronautArmRight1}></div>
                    <div className={styles.astronautArmRight2}></div>
                    <div className={styles.astronautArmThumbLeft}></div>
                    <div className={styles.astronautArmThumbRight}></div>
                    <div className={styles.astronautLegLeft}></div>
                    <div className={styles.astronautLegRight}></div>
                    <div className={styles.astronautFootLeft}></div>
                    <div className={styles.astronautFootRight}></div>
                    <div className={styles.astronautWristLeft}></div>
                    <div className={styles.astronautWristRight}></div>

                    <div className={styles.astronautCord}>
                        <canvas id="cord" height="500" width="500"></canvas>
                    </div>

                    <div className={styles.astronautHead}>
                        <canvas id="visor" width="60" height="60"></canvas>
                        <div className={styles.astronautHeadVisorFlare1}></div>
                        <div className={styles.astronautHeadVisorFlare2}></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;