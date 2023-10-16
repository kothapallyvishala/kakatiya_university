import { subjects } from "./subjects";

export const errorHandler = (data, res, code = 400) => {
  res.status(code).json({
    hasError: true,
    errorMessage: data,
  });
};

export const responseHandler = (data, res, code = 200) => {
  res.status(code).json({
    hasError: false,
    data,
  });
};

export const validateAllOnce = (fields) => {
  for (let key in fields) {
    if (typeof fields[key] === "string") {
      if (fields[key].trim() === "") {
        throw `${key} required`;
      }
    } else {
      if (fields[key] === null) {
        throw `${key} required`;
      }
    }
  }
};

export const getValue = (obj, path, defaultValue) => {
  try {
    if (!(obj instanceof Array)) {
      let myValue = obj;
      for (const key of path) {
        if (!key) {
          break;
        }
        if (!key in myValue) {
          return defaultValue;
        } else {
          myValue = myValue[key];
        }
      }
      return myValue;
    }
  } catch (error) {
    return defaultValue;
  }
};

export const getSemesters = () => {
  const semesters = [];

  for (const semIndex in subjects) {
    semesters.push(semIndex);
  }

  return semesters;
};

export const getSubjects = () => {
  const subjectsSet = new Set();

  for (const semIndex in subjects) {
    const semester = subjects[semIndex];
    for (const branchIndex in semester) {
      const branch = semester[branchIndex];
      branch.map((sub) => {
        subjectsSet.add(sub);
      });
    }
  }

  return subjectsSet;
};
