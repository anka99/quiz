import { numberToTime } from "../tools/timeTools.js";
const version = 1;
const name = "Scores";
const storeName = "ScoresStore";
let Scores = (() => {
    class Scores {
        static addQuizScoreDetailed(questions, answers, time) {
            const request = Scores.openDB();
            let db;
            let store;
            let index;
            let transaction;
            request.onsuccess = () => {
                db = request.result;
                transaction = db.transaction(storeName, "readwrite");
                store = transaction.objectStore(storeName);
                index = store.index("totalTime");
                let timeStr = numberToTime(time);
                let userAnswersTimes = Scores.getTimes(questions);
                let userPenalties = Scores.getPenalties(questions, answers);
                store.put({
                    totalTime: timeStr,
                    questionsTimes: userAnswersTimes,
                    correctness: userPenalties,
                });
                transaction.oncomplete = () => {
                    db.close();
                };
            };
        }
        static extractScores(fun, rendered) {
            const request = Scores.openDB();
            let db;
            let store;
            let index;
            let transaction;
            request.onsuccess = () => {
                db = request.result;
                transaction = db.transaction(storeName, "readwrite");
                store = transaction.objectStore(storeName);
                index = store.index("totalTime");
                const getAllRequest = index.getAll();
                getAllRequest.onsuccess = () => {
                    let res = getAllRequest.result;
                    let times = Array(res.length);
                    let i = 0;
                    res.forEach((record) => {
                        times[i] = record.totalTime;
                        i++;
                    });
                    console.log(times);
                    fun(times, rendered);
                };
            };
        }
    }
    Scores.openDB = () => {
        const request = window.indexedDB.open(name, version);
        let db;
        let store;
        let index;
        request.onupgradeneeded = () => {
            db = request.result;
            store = db.createObjectStore(storeName, { autoIncrement: true });
            index = store.createIndex("totalTime", "totalTime", { unique: false });
        };
        return request;
    };
    Scores.addQuizScoreRaw = (time) => {
        const request = Scores.openDB();
        let db;
        let store;
        let index;
        let transaction;
        request.onsuccess = () => {
            db = request.result;
            transaction = db.transaction(storeName, "readwrite");
            store = transaction.objectStore(storeName);
            index = store.index("totalTime");
            let timeStr = numberToTime(time);
            store.put({
                totalTime: timeStr,
            });
            transaction.oncomplete = () => {
                db.close();
            };
        };
    };
    Scores.getTimes = (questions) => {
        let times = new Array(questions.length);
        let i = 0;
        questions.forEach((q) => {
            times[i] = q.getTime().toString();
            i++;
        });
        return times;
    };
    Scores.getPenalties = (questions, answers) => {
        let penalties = new Array(questions.length);
        let i = 0;
        questions.forEach((q) => {
            penalties[i] = q.checkAnswer(answers.getAnswer(q.questionId)).toString();
            i++;
        });
        return penalties;
    };
    return Scores;
})();
export default Scores;
//# sourceMappingURL=Scores.js.map