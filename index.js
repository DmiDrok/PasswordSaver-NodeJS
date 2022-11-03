const fs = require("fs")
const path = require("path")

const fileName = "./passwords.json"
const flags = process.argv.slice(2)
const flagHelp = "--help"

let allInfo = null

// Если файла с паролями не существует
if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, JSON.stringify({}))
}

// Заносим все пароли в объект в переменную
allInfo = require("./passwords.json")

// Вывод логина и пароля в консоль
function showInfo(info) {
    console.log(`Группа ${info.groupName} успешно найдена:`)
    console.log(info)
    console.log(`Указанный логин: ${info.login}`)
    console.log(`Пароль: ${info.password}`)
}

// Занести / обновить в хранилище группу
function setGroup(group, login, password) {
    let alreadyBeen = Boolean(allInfo[group])
    let finallyWord = alreadyBeen ? "изменена" : "добавлена"

    // Прочерк - значит значение не должно измениться
    if (login == "-") login = allInfo[group].login
    if (password == "-") password = allInfo[group].password

    allInfo[group] = {
        login: login,
        password: password,
        groupName: group,
    }
    console.log(`Группа ${group} успешно ${finallyWord}!`)
}

// Информация по пользованию программой (команда --help)
function showHelp() {
    console.log("\nДобавление / изменение группы:\n-название группы- -логин-[-] -пароль-[-]")
    console.log("\nПолучение информации:\n-название группы-\n")
}

// Если были переданы флаги
if (flags) {
    // Если пользователь хочет создать группу
    if (flags.length > 1) {
        if (flags.length % 3 == 0) {
            for (let i = 0; i < flags.length; i++) {
                let groupName = flags[i]
                let login = flags[i+1]
                let password = flags[i+2]

                if (groupName && login && password) {
                    setGroup(groupName, login, password)
                }
            }

            fs.writeFile(fileName, JSON.stringify(allInfo, null, 4), (err) => {
                if (err) throw err
            })
        } else {
            console.log("Недопустимое количество аргументов.")
        }
    }

    // Если пользователь ввёл флаг для получения помощи
    else if (flags[0] == flagHelp) {
        showHelp()
    }

    // Если пользователь хочет получить данные по указанной группе
    else if (flags.length == 1) {
        let groupName = flags[0]
        let info = allInfo[groupName]

        if (!info) {
            for (let group in allInfo) {
                if (groupName[0] == group[0]) {
                    info = allInfo[group]
                }
            }
        }

        if (info) {
            showInfo(info)
        } else {
            console.log("Группа не найдена, попробуйте её добавить.")
        }
    }

    // Если логин не был указан
    else {
        console.log("Укажите название группы.\nПомощь: --help")
    }
}