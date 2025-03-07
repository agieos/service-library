<!-- 
Step 2: Install project-a as a Local Dependency in project-b
Go to project-b and run: npm install ../project-a
Step 3: Import the Module in project-b
const helper = require('project-a-helper');
console.log(helper.sayHello()); // Output: Hello from Project A!
-->

echo "# service-library" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/agieos/service-library.git
git push -u origin main