import * as vscode from 'vscode';
import * as fs from 'fs';

interface FileFunctions {
	[fileName: string]: string[];
}

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('refactor-unused-code.showUnusedFunctionsFile', async () => {
		const editor = vscode.window.activeTextEditor;

		if (editor?.document.languageId !== 'php') {
			vscode.window.showErrorMessage('This command can only be used in PHP files.');
			return;
		}

		const currentFilePath = editor.document.uri.fsPath;
		const currentFileFunctions = extractFunctionsFromFile(currentFilePath);

		if (!currentFileFunctions.length) {
			vscode.window.showInformationMessage('No functions found in this file!');
			return;
		}

		findFilesWithUniqueTerms(currentFileFunctions);

	});

	context.subscriptions.push(disposable);
}

/**
 * Extrai funções de um arquivo
 * @param filePath 
 * @returns 
 */
function extractFunctionsFromFile(filePath: string): string[] {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const functionMatches = fileContent.match(/function\s+(\w+)/gm);

	return functionMatches ? functionMatches.map(match => match.replace(/function\s+/, '')) : [];
}


/**
 * Abre novo documento com um texto nele
 * @param content 
 */
async function openNewDocument(content: string) {
	const uri = vscode.Uri.parse('untitled:result.md');
	const document = await vscode.workspace.openTextDocument(uri);
	await vscode.window.showTextDocument(document);
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), content);
		});
	}
}


/**
 * Localiza funções únicas no workspace
 * @param terms 
 * @returns 
 */
async function findFilesWithUniqueTerms(terms: string[]): Promise<string[]> {
	const uniqueTerms: string[] = [];
	const termsFound: { [key: string]: number } = {};
	let output: string = '';
	terms.forEach((term) => {
		termsFound[term] = 0;
	});


	const uris = await vscode.workspace.findFiles('**/*.{php,js,jsx,ts,html}', '{**/vendor/**,**/node_modules/**,**/libs/**,**/dist/**,**/writable/**}');
	vscode.window.showInformationMessage(`Searching for ${terms.length} functions in ${uris.length} files (php,js,jsx,ts,html)! Please wait...`);
	for (const uri of uris) {
		const fileContent = await vscode.workspace.fs.readFile(uri);
		terms.forEach((term) => {
			const regex = new RegExp(term, 'g');
			const matches = fileContent.toString().match(regex) || [];
			termsFound[term] += matches.length;
		});
	}
	terms.forEach((term) => {
		if (termsFound[term] === 1) {
			uniqueTerms.push(term);
		}
	});

	
	output += `# ${uniqueTerms.length} unused functions found!\n\n`;
	uniqueTerms.forEach((term) => {
		output += `- The function "${term}" appears to be unused.\n`;
	});
	

	await openNewDocument(output);

	return uniqueTerms;
}



