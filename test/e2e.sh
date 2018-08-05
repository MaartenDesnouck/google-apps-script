#!/bin/bash

success=0;
total=0;

epoch=$(date +%s)

commonPart='gas_e2e_'$epoch
projectName1=$commonPart'_project1'
newProjectName1=$commonPart'_project1_renamed'
projectId1=''

projectName2=$commonPart'_project2'
projectId2=''
projectRootFolder2=$commonPart'_project2_rootFolder'

projectName3=$commonPart'_project3'
projectId3=''

projectName4=$commonPart'_project4'
projectName5=$commonPart'_project5'
projectName6=$commonPart'_project6'
projectName7=$commonPart'_project7'
projectName8=$commonPart'_project8'
projectName9=$commonPart'_project9'
projectName10=$commonPart'_project10'
projectName11=$commonPart'_project11'
projectName12=$commonPart'_project12'

configTestFolder='configTest'

idLenght=57

# Setup
sudo npm install
sudo npm link
rm -r $commonPart*

# Put credentials in the right location ($token is set in Circl CI env vars)
if [ $token ];
then
    mkdir ~/.google-apps-script
    printf $token > ~/.google-apps-script/token.json
fi

# Functions
function assertRegex {
    total=$((total+1))
    identifier=$1
    result=$2
    pattern=$3
    if [[ "$result" =~ $pattern ]];
    then
        printf "[✔] $identifier\n"
        success=$((success+1))
    else
        printf "[✘] $identifier\n"
        printf ">$result<\n"
    fi
}

function assertFileExists {
    total=$((total+1))
    identifier=$1
    name=$2
    if [ -e $name ];
    then
        printf "[✔] $identifier\n"
        success=$((success+1))
    else
        printf "[✘] $identifier\n"
    fi
}

function assertFileDoesNotExist {
    total=$((total+1))
    identifier=$1
    name=$2
    if [ ! -e $name ];
    then
        printf "[✔] $identifier\n"
        success=$((success+1))
    else
        printf "[✘] $identifier\n"
    fi
}

function assertFolderExists {
    total=$((total+1))
    identifier=$1
    name=$2
    if [ -f $name ];
    then
        printf "[✔] $identifier\n"
        success=$((success+1))
    else
        printf "[✘] $identifier\n"
    fi
}

function assertFolderDoesNotExist {
    total=$((total+1))
    identifier=$1
    name=$2
    if [ ! -f $name ];
    then
        printf "[✔] $identifier\n"
        success=$((success+1))
    else
        printf "[✘] $identifier\n"
    fi
}



printf '\n\n[Auth test]\n'

result=$(gas auth)
pattern="You are successfully authenticated as '.*' \[.*\]"
assertRegex "auth returns successfully" "$result" "$pattern"



printf '\n\n[Get project, show and create test]\n'

result=$(gas get projects $projectName1)
pattern="No remote standalone projects matching the filter found \[.*\]"
assertRegex "gas get of a project we are going to create returns no results yet" "$result" "$pattern"

result=$(gas show $projectName1)
pattern="No remote project with name or id '$projectName1' found \[.*\]"
assertRegex "gas show by name of project we are going to create returns no results yet" "$result" "$pattern"

gas create project $projectName1

result=$(gas get projects $projectName1)
pattern="^ID.*NAME.*(.{$idLenght}) $projectName1$"
assertRegex "gas get projects by name of created project returns a result" "$result" "$pattern"

projectId1=${BASH_REMATCH[1]}

result=$(gas show $projectId1)
pattern="NAME             $projectName1.*ID               $projectId1.*"
assertRegex "gas show by project id of created project returns correct name and id" "$result" "$pattern"

# Second project we are going to create should not exist yet
result=$(gas get projects $projectName2)
pattern="No remote standalone projects matching the filter found \[.*\]"
assertRegex "gas get projects of second project we are ging to create returns no results yet" "$result" "$pattern"

gas create project $projectName2

result=$(gas get projects $projectName2)
pattern="^ID.*NAME.*(.{$idLenght}) $projectName2$"
assertRegex "gas get projects by name of second project we created returns a result" "$result" "$pattern"

projectId2=${BASH_REMATCH[1]}

result=$(gas show $projectId2)
pattern="NAME             $projectName2.*ID               $projectId2.*"
assertRegex "gas show by id of second project we created returns a result with the correct name" "$result" "$pattern"

result=$(gas get projects $commonPart)
pattern="^ID.*NAME.*$projectId1 $projectName1.*$projectId2 $projectName2$"
assertRegex "gas get projects of the common prefix returns project1 and project2 with the correct names and ids" "$result" "$pattern"



printf '\n\n[Rename test]\n'

result=$(gas show $projectId1)
pattern="NAME             $projectName1.*ID               $projectId1.*"
assertRegex "gas show of project we are renaming by name exists by id" "$result" "$pattern"

gas rename $projectName1 $newProjectName1

result=$(gas show $newProjectName1)
pattern="NAME             $newProjectName1.*ID               $projectId1.*"
assertRegex "gas show of project we renamed by name exists with new name and has old id" "$result" "$pattern"

result=$(gas show $projectName1)
pattern="No remote project with name or id '$projectName1' found \[.*\]"
assertRegex "gas show of the old name returns a not found message" "$result" "$pattern"

result=$(gas show $projectId1)
pattern="NAME             $newProjectName1.*ID               $projectId1.*"
assertRegex "gas show of the id returns the new name" "$result" "$pattern"



printf "\n\n[Delete test]\n"

result=$(gas show $newProjectName1)
pattern="NAME             $newProjectName1.*ID               $projectId1.*"
assertRegex "the project we are deleting by name exists by name" "$result" "$pattern"

gas delete project $newProjectName1

result=$(gas show $newProjectName1)
pattern="No remote project with name or id '$newProjectName1' found \[.*\]"
assertRegex "gas show by name of the project we deleted by name returns a not found message" "$result" "$pattern"

result=$(gas show $projectId1)
pattern="No remote project with name or id '$projectId1' found \[.*\]"
assertRegex "the project we deleted by name no longer exists by id" "$result" "$pattern"

gas create project $projectName3

result=$(gas show $projectName3)
pattern="NAME             $projectName3.*ID               (.{$idLenght}).*"
assertRegex "the third project we created exists by name" "$result" "$pattern"

projectId3=${BASH_REMATCH[1]}

result=$(gas show $projectId3)
pattern="NAME             $projectName3.*ID               $projectId3.*"
assertRegex "the project we are deleting by id exists by id" "$result" "$pattern"

gas delete project $projectId3

result=$(gas show $projectName3)
pattern="No remote project with name or id '$projectName3' found \[.*\]"
assertRegex "the project we deleted by id no longer exists by name" "$result" "$pattern"

result=$(gas show $projectId3)
pattern="No remote project with name or id '$projectId3' found \[.*\]"
assertRegex "the project we deleted by id no longer exists by id" "$result" "$pattern"



printf '\n\n[Link, unlink and pull test]\n'

result=$(gas show $projectId2)
pattern="NAME             $projectName2.*ID               $projectId2.*"
assertRegex "the project we are linking by id and then pulling exists by id" "$result" "$pattern"

mkdir $projectRootFolder2
cd $projectRootFolder2 || exit 1
gas link $projectId2

result=$(cat .gas/ID)
assertRegex ".gas/ID exists after the link" "$result" "$projectId2"

mkdir 'subfolder'
cd 'subfolder' || exit 1
gas unlink
cd ..

assertFolderDoesNotExist ".gas folder does not exist after the unlink" ".gas"

gas link $projectId2
gas pull
cd ..

result=$(cat $projectRootFolder2/Code.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "Code.js exists after the pull" "$result" "$pattern"


cd $projectRootFolder2 || exit 1
mkdir 'testFolder'
cd 'testFolder' || exit 1

result=$(gas link $projectId2)
pattern="You seem to be linking a project inside another project. Cowardly chose not to do that."
assertRegex "linking a project to a subfolder of another project fails" "$result" "$pattern"

cd ..

gas create project $projectName4

result=$(gas link $projectName4)
pattern="Linking '$projectName4' to this folder... \[.*\]"
assertRegex "linking a project to a folder that is already linked to a project is possible" "$result" "$pattern"

gas link $projectId2



printf '\n\n[Push and clone test]\n'

printf '//test1\n' > test1.js
printf '{}\n' > appsscript.json
printf '{}\n' > notallowed.json
cd 'testFolder' || exit 1
printf '//test2\n' > test2.js
cd ..
mkdir 'testFolder2' && cd 'testFolder2' || exit 1
mkdir 'testFolder3' && cd 'testFolder3' || exit 1
printf '//test3\n' > test3.js
cd ..
cd ..
gas push
cd ..

gas clone $projectId2

result=$(cat $projectName2/test1.js)
assertRegex "test1.js exists in the cloned project after it was pushed in an another folder linked to the same project" "$result" "//test1"

result=$(cat $projectName2/appsscript.json)
assertRegex "appsscript.json exists in the cloned project after it was pushed in an another folder linked to the same project" "$result" "\{\}"

assertFileDoesNotExist "notallowed.json should not have been added to the project" "$projectName2/notallowed.json"

result=$(cat $projectName2/testFolder/test2.js)
assertRegex "/testFolder/test2.js exists in the cloned project after it was pushed in an another folder linked to the same project" "$result" "//test2"

result=$(cat $projectRootFolder2/testFolder2/testFolder3/test3.js)
assertRegex "testFolder2/testFolder3/test3.js exists in the cloned project after it was pushed in an another folder linked to the same project" "$result" "//test3"

result=$(cat $projectName2/Code.js)
assertRegex "Code.js exists in the cloned project after it was pushed in an another folder linked to the same project" "$result" "function myFunction\(\) \{.*\}"

assertFileExists ".gitignore exists in $projectName2" "$projectName2/.gitignore"

result=$(cat $projectName2/.gas/ID)
assertRegex "$projectName2/.gas/ID exists in the cloned project and it has the right content" "$result" "$projectId2"

# Delete test2.js, modfy Code.js and create test4.js and push from projectRootFolder2 and pull in projectName2
cd $projectRootFolder2 || exit 1
printf '//Code modified\n' > Code.js
printf '//test4\n' > test4.js
cd testFolder || exit 1
rm test2.js
cd ..

# Do a gas push and pull in a different project
gas push
cd ..
cd $projectName2 || exit 1
gas pull
cd ..

# test2.js should not exist anymore
assertFileDoesNotExist "We removed test2.js, pushed and then pulled in project2, so test2.js should have been deleted" "$projectName2/testFolder/test2.js"

# test3.js should exist in $projectName2/testFolder2/testFolder3
result=$(cat $projectName2/testFolder2/testFolder3/test3.js)
assertRegex "test3.js should still exist in project2" "$result" "//test3"

# testFolder should not exist amymore
assertFileDoesNotExist "We removed all files from testfolder, pushed and then pulled in project2, so testfolder should have been deleted" "$projectName2/testFolder"

# Delete folder
rm -r $projectName2

# Code.js should not exist in $projectName2
assertFileDoesNotExist "We removed the entire project locally so Code.js should not exist" "$projectName2/Code.js"

# Clone using projectName
gas clone $projectName2

# Code.js should have a specific content in $projectName2
result=$(cat $projectName2/Code.js)
assertRegex "The Code file of our cloned project exists and contains the modified content" "$result" "//Code modified"

# ID should exist in $projectName2/.gas and have projectId2 as content
result=$(cat $projectName2/.gas/ID)
assertRegex "The ID file of our cloned project exists and return the correct projectid" "$result" "$projectId2"



printf '\n\n[Status and pulling/pushing single files test]\n'

# Project we are going to create should not exist yet
result=$(gas get projects $projectName5)
pattern="No remote standalone projects matching the filter found \[.*\]"
assertRegex "Project we are creating does not exist yet" "$result" "$pattern"

gas new $projectName5

# Project we created shoud have info when we look it up using name
result=$(gas show $projectName5)
pattern="NAME             $projectName5.*ID               (.{$idLenght}).*"
assertRegex "Found the correct show for newly created project" "$result" "$pattern"

cd $projectName5 || exit 1
mkdir 'folder'
printf '//' > folder/modified1.js
printf '//' > modified2.js

gas push

rm Code.js
printf '//added' > added.js
printf '//modified' > folder/modified1.js
printf '//modified2' > modified2.js
printf '//' > invalid.txt

result=$(gas status)
pattern="There are some differences between your local and remote projectfiles for '$projectName5'.*\+ added\.js.*~ folder/modified1\.js.*~ modified2\.js.*- Code\.js.*"
assertRegex "1 added, 2 modified and 1 removed file" "$result" "$pattern"

gas push added.js
gas push folder/modified1.js 

result=$(gas status)
pattern="There are some differences between your local and remote projectfiles for '$projectName5'.*~ modified2\.js.*- Code\.js.*"
assertRegex "1 modified and 1 removed file" "$result" "$pattern"

gas push added.js -d

result=$(gas status)
pattern="There are some differences between your local and remote projectfiles for '$projectName5'.*\+ added\.js.*~ modified2\.js.*- Code\.js.*"
assertRegex "1 added, 1 modified and 1 removed file" "$result" "$pattern"

gas pull Code.js

result=$(gas status)
pattern="There are some differences between your local and remote projectfiles for '$projectName5'.*\+ added\.js.*~ modified2\.js.*"
assertRegex "1 added and 1 modified file" "$result" "$pattern"

result=$(gas push invalid.txt)
pattern="Can't push this file to remote because of an invalid extension or name"
assertRegex "pushing an invalid file returns an error" "$result" "$pattern"

cd ..



printf '\n\n[New test]\n'

# Project we are going to create should not exist yet
result=$(gas get projects $projectName6)
pattern="No remote standalone projects matching the filter found \[.*\]"
assertRegex "Project we are creating does not exist yet" "$result" "$pattern"

gas new $projectName6

# Project we created shoud have info when we look it up using name
result=$(gas show $projectName6)
pattern="NAME             $projectName6.*ID               (.{$idLenght}).*"
assertRegex "Found the correct show for newly created project" "$result" "$pattern"

projectId6=${BASH_REMATCH[1]}

result=$(cat $projectName6/Code.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "Code.js exists in the project6 folder" "$result" "$pattern"

result=$(cat $projectName6/.gas/ID)
assertRegex "the .gas/ID file for project6 exists" "$result" "$projectId6"



printf '\n\n[Config test]\n'

mkdir $configTestFolder
cd $configTestFolder

# when not configured, config file should contain {}
gas config -e config1.json
result=$(cat config1.json)
pattern="\{\}"
assertRegex "the config file is correct (1/6)" "$result" "$pattern"

# configure gas to use .gs
printf 'y\nn\n' | gas config
gas config -e config2.json

result=$(cat config2.json)
pattern="\{\"extension\":\"\.gs\"\}"
assertRegex "the config file is correct (2/6)" "$result" "$pattern"

# configure gas to use a custom Oauth 2.0 project
printf 'n\ny\nA\nB\n' | gas config
gas config -e config3.json

result=$(cat config3.json)
pattern="\{\"client\":\{\"id\":\"A\",\"secret\":\"B\"\}\}"
assertRegex "the config file is correct (3/6)" "$result" "$pattern"

# configure gas to use a custom Oauth 2.0 project and .gs
printf 'y\ny\nA\nB\n' | gas config
gas config -e config4.json

result=$(cat config4.json)
pattern="\{\"extension\":\"\.gs\",\"client\":\{\"id\":\"A\",\"secret\":\"B\"\}\}"
assertRegex "the config file is correct (4/6)" "$result" "$pattern"

# testing config -r
gas config -r
gas config -e config5.json
result=$(cat config5.json)
pattern="\{\}"
assertRegex "the config file is correct (5/6)" "$result" "$pattern"

# import a config file
gas config -i config2.json
gas config -e config6.json

result=$(cat config6.json)
pattern="\{\"extension\":\"\.gs\"\}"
assertRegex "the config file is correct (6/6)" "$result" "$pattern"

# importing a config file without a path
result=$(gas config -i)
pattern="Please provide a config file to import \[.*\]"
assertRegex "config throws error when forgetting config file" "$result" "$pattern"

# exporting a config file without a path
result=$(gas config -e)
pattern="\{\"extension\":\"\.gs\"\}"
assertRegex "exporting a config file without a path just prints the config" "$result" "$pattern"

cd ..

# Put config in the right location ($config is set in Circl CI env vars)
if [ $config ];
then
    printf $config > ~/.google-apps-script/config.json
fi

# update the token for the new config
if [ $config_token ];
then
    printf $config_token > ~/.google-apps-script/token.json
fi

# Project we are going to create should not exist yet
result=$(gas get projects $projectName7)
pattern="No remote standalone projects matching the filter found \[.*\]"
assertRegex "Project we are creating does not exist yet" "$result" "$pattern"

gas new $projectName7
cd $projectName7 || exit 1

# assert that Code.gs exists after clone
result=$(cat Code.gs)
pattern="function myFunction\(\) \{.*\}"
assertRegex "Code.gs exists after the pull" "$result" "$pattern"

mkdir 'folder'
printf '//js' > folder/js.js
printf '//gs' > folder/gs.gs

# assert that pushing js.js fails
result=$(gas push folder/js.js)
pattern="Pushing .* > folder/js.js' to remote ... \[.*\].*Can't push this file to remote because of an invalid extension or name"
assertRegex "js.js is unpushable" "$result" "$pattern"

# assert that pushing gs.gs succeeds
result=$(gas push folder/gs.gs)
pattern="Pushing .* > folder/gs.gs' to remote ... \[.*\]"
assertRegex "gs.gs is pushable" "$result" "$pattern"

printf '//gs' > folder/gs2.gs
gas push
cd ..
rm -rf $projectName7
gas clone $projectName7

# assert that Code.gs exists after clone
result=$(cat $projectName7/Code.gs)
pattern="function myFunction\(\) \{.*\}"
assertRegex "Code.gs exists after the pull" "$result" "$pattern"

# assert that gs.gs exists after clone
result=$(cat $projectName7/folder/gs.gs)
pattern="//gs"
assertRegex "gs.gs exists after the pull" "$result" "$pattern"

# assert that js.gs does not exist after clone
assertFileDoesNotExist "folder/js.gs should not have been added to the project" "$projectName7/folder/js.gs"

# assert that js.js does not exist after clone
assertFileDoesNotExist "folder/js.js should not have been added to the project" "$projectName7/folder/js.js"



printf '\n\n[Versions test]\n'

gas new $projectName8
cd $projectName8 || exit 1

# assert that creating new version gives correct output
result=$(gas create version)
pattern="Creating new version for '$projectName8'... \[.*\].*1.*"
assertRegex "created new version" "$result" "$pattern"

# assert that creating new version with project gives correct output
result=$(gas create version -p $projectName8)
pattern="Creating new version for '$projectName8'... \[.*\].*1.*"
assertRegex "created new version with project specified" "$result" "$pattern"

# assert that creating new version with description gives correct output
result=$(gas create version -d e2e-version-test)
pattern="Creating new version for '$projectName8'... \[.*\].*2.*e2e-version-test"
assertRegex "created new version with description specified" "$result" "$pattern"

# assert that getting all versions gives correct output
result=$(gas get versions)
pattern=".*1.*2.*e2e-version-test.*"
assertRegex "listed all versions" "$result" "$pattern"

cd ..



printf '\n\n[Deployments test]\n'

gas new $projectName9
cd $projectName9 || exit 1

# assert that creating new deployment gives correct output
result=$(gas create deployment)
pattern="Creating new deployment for '$projectName9'... \[.*\].*1.*"
assertRegex "created new deployment" "$result" "$pattern"

# assert that creating new deployment with projectgives correct output
result=$(gas create deployment -p $projectName9)
pattern="Creating new deployment for '$projectName9'... \[.*\].*1.*"
assertRegex "created new deployment with project specified" "$result" "$pattern"

# assert that creating new deployment with versionNumber gives correct output
result=$(gas create deployment -v 1)
pattern="Creating new deployment for '$projectName9'... \[.*\].*1.*"
assertRegex "created new deployment with version specified" "$result" "$pattern"

# assert that creating new deployment with description gives correct output
result=$(gas create deployment -d e2e-deployment-test)
pattern="Creating new deployment for '$projectName9'... \[.*\].*2.*e2e-deployment-test"
assertRegex "created new deployment with description specified" "$result" "$pattern"

# assert that getting all deployments gives correct output
result=$(gas get deployments)
pattern=".*1.*2.*e2e-deployment-test.*"
assertRegex "listed all deployments" "$result" "$pattern"

cd ..



printf '\n\n[Include test]\n'

gas new $projectName10
cd $projectName10 || exit 1

gas include -s sheet

result=$(cat gas-include.json)
assertRegex "gas-include.json exists and has the right content" "$result" "\{\"dependencies\":\{\"sheet\":\"\^1.0.0\"\}\}"

result=$(cat gas-include/sheet/sheet.gs)
assertRegex "the sheet package has been included" "$result" ".*sheet_getValue.*"

result=$(cat gas-include/content.json)
assertRegex "gas-include/content.json exists and has the right content" "$result" "\{\"sheet_1_0_0\":\{\"isRootDependency\":true,\"packageName\":\"sheet\",\"version\":\"1_0_0\"\}\}"

cd ..



printf '\n\n[Publish test]\n'
gas new $projectName11
cd $projectName11 || exit 1

# TODO
# get the version of a fixed package
# bump that package number
# include that package in a new test ?

cd ..



printf '\n\n[Ignore test]\n'

gas new $projectName12
cd $projectName12 || exit 1
printf '//test1\n' > test1.gs

mkdir 'testFolder' && cd 'testFolder' || exit 1
printf '//test2\n' > test2.gs
cd ..

mkdir 'ignoreFolder1' && cd 'ignoreFolder1' || exit 1
printf '//file1\n' > file1.gs
cd ..

mkdir 'ignoreFolder2' && cd 'ignoreFolder2' || exit 1
printf '//file2\n' > file2.gs
cd ..

printf 'ignoreFolder1/*\nignoreFolder2/*' > .gasignore

gas push
gas pull

assertFileExists "ignoreFolder1/file1.gs still exists" "ignoreFolder1/file1.gs"
assertFileExists "ignoreFolder2/file2.gs still exists" "ignoreFolder2/file2.gs"

rm ignoreFolder1/file1.gs
rm testFolder/test2.gs
gas pull

assertFileDoesNotExist "ignoreFolder1/file1.gs does not exist again" "ignoreFolder1/file1.gs"
assertFolderDoesNotExist "ignoreFolder1 does not exists anymore" "ignoreFolder1"
assertFileExists "ignoreFolder2/file2.gs still exists" "ignoreFolder2/file2.gs"
assertFileExists "test1.gs still exists" "test1.gs"
assertFileExists "testFolder/test2.gs still exists again" "testFolder/test2.gs"



# Cleaning up at the end by deleting reCodeing projects and folders
printf '\n\n[Cleaning up]\n'
gas delete project $projectId2
gas delete project $projectName4
gas delete project $projectName5
gas delete project $projectName6
gas delete project $projectName7
gas delete project $projectName8
gas delete project $projectName9
gas delete project $projectName10
gas delete project $projectName11
gas delete project $projectName12
rm -r $projectName2
rm -r $projectRootFolder2
rm -r $projectName5
rm -r $projectName6
rm -r $projectName7
rm -r $projectName8
rm -r $projectName9
rm -r $configTestFolder


printf "____________________________________________\n"
printf "Test result: $success/$total\n"

if [ $total -gt $success ];
then
    exit 1
else
    exit 0
fi
