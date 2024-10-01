"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
function activate(context) {
    vscode.window.showInformationMessage('Active Refactor Unused Code!');
    let teste = function () {
        vscode.window.showInformationMessage('Call teste');
        const editor = vscode.window.activeTextEditor;
        const currentFilePath = editor.document.uri.fsPath;
        const currentFileFunctions = extractFunctionsFromFile(currentFilePath);
        findStringInWorkspace(currentFileFunctions);
        vscode.window.showInformationMessage(currentFileFunctions.join(', '));
    };
    teste();
    let disposable = vscode.commands.registerCommand('refactor-unused-code.showUnusedFunctionsFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor?.document.languageId !== 'php') {
            vscode.window.showErrorMessage('Este comando só pode ser executado em arquivos PHP.');
            return;
        }
        const currentFilePath = editor.document.uri.fsPath;
        const currentFileFunctions = extractFunctionsFromFile(currentFilePath);
        if (!currentFileFunctions.length) {
            vscode.window.showInformationMessage('Nenhuma função encontrada no arquivo.');
            return;
        }
        const allFunctionsUsages = await findFunctionUsagesInFolder(vscode.workspace.workspaceFolders[0].uri.fsPath);
        const unusedFunctions = findUnusedFunctions(currentFileFunctions, allFunctionsUsages);
        if (!unusedFunctions.length) {
            vscode.window.showInformationMessage('Todas as funções do arquivo estão sendo utilizadas.');
            return;
        }
        renderFilesTreeView(unusedFunctions);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function extractFunctionsFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const functionMatches = fileContent.match(/function\s+(\w+)/gm);
    return functionMatches ? functionMatches.map(match => match.replace(/function\s+/, '')) : [];
}
async function findStringInWorkspace(strings) {
    const results = [];
    for (const str of strings) {
        const query = `*${str}*`;
        const files = await vscode.workspace.findFiles(query, '**/*', 1);
        if (files.length === 1) {
            const document = await vscode.workspace.openTextDocument(files[0]);
            vscode.window.showTextDocument(document);
        }
        else if (files.length > 1) {
            results.push(`A string "${str}" foi encontrada em mais de um arquivo.`);
        }
        else {
            results.push(`A string "${str}" não foi encontrada no workspace.`);
        }
    }
    if (results.length > 0) {
        vscode.window.showInformationMessage(results.join('\n'));
    }
}
//# sourceMappingURL=extension.js.map