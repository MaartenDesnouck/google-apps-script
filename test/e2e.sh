#!/bin/bash

success=0;
total=0;

epoch=$(date +%s)

commonPart='gas_e2e'
projectName1=$commonPart'_'$epoch'_project1'
newProjectName1=$commonPart'_'$epoch'_project1_renamed'
projectId1=''

projectName2=$commonPart'_'$epoch'_project2'
projectId2=''
projectRootFolder2=$commonPart'_'$epoch'_project2_rootFolder'

projectName3=$commonPart'_'$epoch'_project3'
projectId3=''

projectName4=$commonPart'_'$epoch'_project4'

projectName5=$commonPart'_'$epoch'_project5'

projectName6=$commonPart'_'$epoch'_project6'

idLenght=57

# Setup
npm install
npm link
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
        printf "  $result\n"
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

function assertFolderDoesNotExists {
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
pattern="You are successfully authenticated as '.*' \[✔\]";
assertRegex "auth returns succesful" "$result" "$pattern"



printf '\n\n[List, info and create test]\n'

result=$(gas list $projectName1)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "gas list of project we are going to create returns no results yet" "$result" "$pattern"

result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive \[✘\].*"
assertRegex "gas info by name of project we are going to create returns no results yet" "$result" "$pattern"

gas create $projectName1

result=$(gas list $projectName1)
pattern="^\[(.{$idLenght})\] $projectName1$"
assertRegex "gas list by name of created project returns a result" "$result" "$pattern"

projectId1=${BASH_REMATCH[1]}

result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "gas info by project id of created project returns correct name and id" "$result" "$pattern"

# Second project we are going to create should not exist yet
result=$(gas list $projectName2)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "gas list of second project we are ging to create returns no results yet" "$result" "$pattern"

gas create $projectName2

result=$(gas list $projectName2)
pattern="^\[(.{$idLenght})\] $projectName2$"
assertRegex "gas list by name of second project we created returns a result" "$result" "$pattern"

projectId2=${BASH_REMATCH[1]}

result=$(gas info $projectId2)
pattern="name:           $projectName2.*id:             $projectId2.*"
assertRegex "gas info by id of second project we created returns a result with the correct name" "$result" "$pattern"

result=$(gas list $commonPart)
pattern="\[$projectId1\] $projectName1.*\[$projectId2\] $projectName2.*"
assertRegex "gas list of the common prefix returns project1 and project2 wiht the correct names and ids" "$result" "$pattern"



printf '\n\n[Rename test]\n'

result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "gas info of project we are renaming by name exists by id" "$result" "$pattern"

gas rename $projectName1 $newProjectName1

result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "gas info of project we renamed by name exists with new name and has old id" "$result" "$pattern"

result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive [✘]*"
assertRegex "gas info of the old name returns a not found message" "$result" "$pattern"

result=$(gas info $projectId1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "gas info of the id returns the new name" "$result" "$pattern"



printf "\n\n[Delete test]\n"

result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "the project we are deleting by name exists by name" "$result" "$pattern"

gas delete $newProjectName1

result=$(gas info $newProjectName1)
pattern="No project with name or id '$newProjectName1' found in your Google Drive \[✘\].*"
assertRegex "gas info by name of the project we deleted by name returns a not found message" "$result" "$pattern"

result=$(gas info $projectId1)
pattern="No project with name or id '$projectId1' found in your Google Drive \[✘\].*"
assertRegex "the project we deleted by name no longer exists by id" "$result" "$pattern"

gas create $projectName3

result=$(gas info $projectName3)
pattern="name:           $projectName3.*id:             (.{$idLenght}).*"
assertRegex "the third project we created exists by name" "$result" "$pattern"

projectId3=${BASH_REMATCH[1]}

result=$(gas info $projectId3)
pattern="name:           $projectName3.*id:             $projectId3.*"
assertRegex "the project we are deleting by id exists by id" "$result" "$pattern"

gas delete $projectId3

result=$(gas info $projectName3)
pattern="No project with name or id '$projectName3' found in your Google Drive \[✘\].*"
assertRegex "the project we deleted by id no longer exists by name" "$result" "$pattern"

result=$(gas info $projectId3)
pattern="No project with name or id '$projectId3' found in your Google Drive \[✘\].*"
assertRegex "the project we deleted by id no longer exists by id" "$result" "$pattern"


printf '\n\n[Link and pull test]\n'

result=$(gas info $projectId2)
pattern="name:           $projectName2.*id:             $projectId2.*"
assertRegex "the project we are linking by id and then pulling exists by id" "$result" "$pattern"

mkdir $projectRootFolder2
cd $projectRootFolder2 || exit 1
gas link $projectId2
gas pull
cd ..

result=$(cat $projectRootFolder2/main.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "main.js exists after the pull" "$result" "$pattern"

result=$(cat $projectRootFolder2/.gas/ID)
assertRegex ".gas/ID exists after the link and pull" "$result" "$projectId2"

cd $projectRootFolder2 || exit 1
mkdir 'testFolder'
cd 'testFolder' || exit 1

result=$(gas link $projectId2)
pattern="You seem to be linking a project inside another project. Cowardly chose not to do that. \[✘\]"
assertRegex "linking a project to a subfolder of another project fails" "$result" "$pattern"

cd ..

gas create $projectName4

result=$(gas link $projectName4)
pattern="Linking '$projectName4' to this folder... \[✔\]"
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

result=$(cat $projectName2/main.js)
assertRegex "main.js exists in the cloned project after it was pushed in an another folder linked to the same project " "$result" "function myFunction\(\) \{.*\}"

assertFileExists ".gitignore exists in $projectName2" "$projectName2/.gitignore"

result=$(cat $projectName2/.gas/ID)
assertRegex "$projectName2/.gas/ID exists in the cloned project and it has the right content" "$result" "$projectId2"

# Delete test2.js, modfy main.js and create test4.js and push from projectRootFolder2 and pull in projectName2
cd $projectRootFolder2 || exit 1
printf '//main modified\n' > main.js
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

# main.js should not exist in $projectName2
assertFileDoesNotExist "We removed the entire project locally so main.js should not exist" "$projectName2/main.js"

# Clone using projectName
gas clone $projectName2

# main.js should have a specific content in $projectName2
result=$(cat $projectName2/main.js)
assertRegex "The main file of our cloned project exists and contains the modified content" "$result" "//main modified"

# ID should exist in $projectName2/.gas and have projectId2 as content
result=$(cat $projectName2/.gas/ID)
assertRegex "The ID file of our cloned project exists and return the correct projectid" "$result" "$projectId2"



printf '\n\n[Status and pulling/pushing single files test]\n'

# Project we are going to create should not exist yet
result=$(gas list $projectName5)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "Project we are creating does not exist yet" "$result" "$pattern"

gas new $projectName5

# Project we created shoud have info when we look it up using name
result=$(gas info $projectName5)
pattern="name:           $projectName5.*id:             (.{$idLenght}).*"
assertRegex "Found the correct info for newly created project" "$result" "$pattern"

cd $projectName5 || exit 1
mkdir 'folder'
printf '//' > folder/modified1.js
printf '//' > modified2.js

gas push

rm main.js
printf '//added' > added.js
printf '//modified' > folder/modified1.js
printf '//modified2' > modified2.js
printf '//' > invalid.txt

result=$(gas status)
pattern="There are some difference between your local files and Google Drive for '$projectName5'.*\+ added\.js.*~ folder/modified1\.js.*~ modified2\.js.*- main\.js.*"
assertRegex "1 added, 2 modified and 1 removed file" "$result" "$pattern"

gas push added.js
gas push folder/modified1.js 

result=$(gas status)
pattern="There are some difference between your local files and Google Drive for '$projectName5'.*~ modified2\.js.*- main\.js.*"
assertRegex "1 modified and 1 removed file" "$result" "$pattern"

gas pull main.js

result=$(gas status)
pattern="There are some difference between your local files and Google Drive for '$projectName5'.*~ modified2\.js.*"
assertRegex "1 modified file" "$result" "$pattern"

result=$(gas push invalid.txt)
pattern="gas returned an error: This file is unpushable to Google Drive because of an invalid extension or name.*"
assertRegex "pushing an invalid file returns an error" "$result" "$pattern"

cd ..



printf '\n\n[New test]\n'

# Project we are going to create should not exist yet
result=$(gas list $projectName6)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "Project we are creating does not exist yet" "$result" "$pattern"

gas new $projectName6

# Project we created shoud have info when we look it up using name
result=$(gas info $projectName6)
pattern="name:           $projectName6.*id:             (.{$idLenght}).*"
assertRegex "Found the correct info for newly created project" "$result" "$pattern"

projectId6=${BASH_REMATCH[1]}

result=$(cat $projectName6/main.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "main.js exists in the project6 folder" "$result" "$pattern"

result=$(cat $projectName6/.gas/ID)
assertRegex "the .gas/ID file for project6 exists" "$result" "$projectId6"



printf '\n\n[Include test]\n'
printf '#TODO'
# do gas include
# check that include file has been created



# Cleaning up at the end by deleting remaining projects and folders
printf '\n\n[Cleaning up]\n'
gas delete $projectId2
gas delete $projectName4
gas delete $projectName5
gas delete $projectName6
rm -r $projectName2
rm -r $projectRootFolder2
rm -r $projectName5
rm -r $projectName6


printf "____________________________________________\n"
printf "Test result: $success/$total\n"

if [ $total -gt $success ];
then
    exit 1
else
    exit 0
fi
