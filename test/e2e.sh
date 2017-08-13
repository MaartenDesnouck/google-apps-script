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
projectId4=''

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

# Testing auth
printf '\n[Auth test]\n'

result=$(gas auth)
pattern="You are successfully authenticated as '.*' \[✔\]";
assertRegex "0.0" "$result" "$pattern"

# Testing gas list and gas create
printf '\n[List, info and create test]\n'

# Project we are going to create should not exist yet (1)
result=$(gas list $projectName1)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "1.0" "$result" "$pattern"


# Project we are going to create should not exist yet (2)
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive \[✘\].*"
assertRegex "1.1" "$result" "$pattern"

# Create project 1
gas create $projectName1

# Project we created should be listable using name and have only one result
result=$(gas list $projectName1)
pattern="^\[(.{$idLenght})\] $projectName1$"
assertRegex "1.2" "$result" "$pattern"

# Parse projectId
projectId1=${BASH_REMATCH[1]}

# Project we created shoud have info when we look it up using name
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "1.3" "$result" "$pattern"

# Project we created should have info when we look it up using id
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "1.4" "$result" "$pattern"

# Second project we are going to create should not exist yet
result=$(gas list $projectName2)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "1.5" "$result" "$pattern"

# Create project 2
gas create $projectName2

# Second project we created should be listable using name and have only one result
result=$(gas list $projectName2)
pattern="^\[(.{$idLenght})\] $projectName2$"
assertRegex "1.6" "$result" "$pattern"

# Parse project id
projectId2=${BASH_REMATCH[1]}

# Second project we created should have info when we look it up using id
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "1.7" "$result" "$pattern"

# List with filter on common part should give us 2 results
result=$(gas list $commonPart)
pattern="\[$projectId1\] $projectName1.*\[$projectId2\] $projectName2.*"
assertRegex "1.8" "$result" "$pattern"

# Testing gas rename
printf '\n[Rename test]\n'

# Project we are going to rename should exist
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
assertRegex "2.0" "$result" "$pattern"

# Rename project
gas rename $projectName1 $newProjectName1

# Project with new name exists and still has the same id
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "2.1" "$result" "$pattern"

# Project with old name no longer exists
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive [✘]*"
assertRegex "2.2" "$result" "$pattern"

# Project with old id has a new name
result=$(gas info $projectId1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "2.3" "$result" "$pattern"

# Testing gas delete
printf "\n[Delete test]\n"

# Project we are going to delete should exists
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
assertRegex "3.0" "$result" "$pattern"

# Delete by name
gas delete $newProjectName1

# Project we deleted should no longer exists based on name
result=$(gas info $newProjectName1)
pattern="No project with name or id '$newProjectName1' found in your Google Drive \[✘\].*"
assertRegex "3.1" "$result" "$pattern"

# Project we deleted should no longer exists based on id
result=$(gas info $projectId1)
pattern="No project with name or id '$projectId1' found in your Google Drive \[✘\].*"
assertRegex "3.2" "$result" "$pattern"

# Create new project
gas create $projectName3

# Project we are going to delete should exist based on name
result=$(gas info $projectName3)
pattern="name:           $projectName3.*id:             (.{$idLenght}).*"
assertRegex "3.3" "$result" "$pattern"

# Parse projectId
projectId3=${BASH_REMATCH[1]}

# Project we are going to delete should exist based on id
result=$(gas info $projectId3)
pattern="name:           $projectName3.*id:             $projectId3.*"
assertRegex "3.4" "$result" "$pattern"

# Delete project based on id
gas delete $projectId3

# Project we deleted should no longer exist based on name
result=$(gas info $projectName3)
pattern="No project with name or id '$projectName3' found in your Google Drive \[✘\].*"
assertRegex "3.5" "$result" "$pattern"

# Project we deleted should no longer exist based on id
result=$(gas info $projectId3)
pattern="No project with name or id '$projectId3' found in your Google Drive \[✘\].*"
assertRegex "3.6" "$result" "$pattern"

# Testing gas link and pull
printf '\n[Link and pull test]\n'

# Project we are going to link and pull should exists
result=$(gas info $projectId2)
pattern="name:           $projectName2.*id:             $projectId2.*"
assertRegex "4.0" "$result" "$pattern"

# Linking and pulling using projectId
mkdir $projectRootFolder2
cd $projectRootFolder2 || exit 1
gas link $projectId2
gas pull
cd ..

# Main.js should exist in $projectRootFolder2
result=$(cat $projectRootFolder2/main.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "4.1" "$result" "$pattern"

# ID should exist in $projectRootFolder2/.gas
result=$(cat $projectRootFolder2/.gas/ID)
assertRegex "4.2" "$result" "$projectId2"

# Linking a project to a subfolder should fail
cd $projectRootFolder2 || exit 1
mkdir 'testFolder'
cd 'testFolder' || exit 1

result=$(gas link $projectId2)
pattern="You seem to be linking a project inside another project. Cowardly chose not to do that. \[✘\]"
assertRegex "4.3" "$result" "$pattern"

cd ..

# Testing gas push and clone
printf '\n[Push, clone and status test]\n'

# Create some files and folders and push them
printf '//test1\n' > test1.js
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

# Clone using projectId
gas clone $projectId2

# test1.js should exist in $projectName2
result=$(cat $projectName2/test1.js)
assertRegex "5.0" "$result" "//test1"

# test2.js should exist in $projectName2/testFolder
result=$(cat $projectName2/testFolder/test2.js)
assertRegex "5.1" "$result" "//test2"

# test3.js should exist in $projectRootFolder2/testFolder2/testFolder3
result=$(cat $projectRootFolder2/testFolder2/testFolder3/test3.js)
assertRegex "5.2" "$result" "//test3"

# main.js should exist in $projectName2
result=$(cat $projectName2/main.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "5.3" "$result" "$pattern"

# .gitignore should exist in $projectName2
assertFileExists "5.4" "$projectName2/.gitignore"

# ID should exist in $projectName2/.gas
result=$(cat $projectName2/.gas/ID)
assertRegex "5.5" "$result" "$projectId2"

# Delete test2.js, modfy main.js and create test4.js and push from projectRootFolder2 and pull in projectName2
cd $projectRootFolder2 || exit 1
printf '//main modified\n' > main.js
printf '//test4\n' > test4.js
cd testFolder || exit 1
rm test2.js
cd ..

# test gas status
gas status

# Do a gas push and pull in a different project
gas push
cd ..
cd $projectName2 || exit 1
gas pull
cd ..

# test2.js should not exist anymore
assertFileDoesNotExist "5.6" "$projectName2/testFolder/test2.js"

# test3.js should exist in $projectName2/testFolder2/testFolder3
result=$(cat $projectName2/testFolder2/testFolder3/test3.js)
assertRegex "5.7" "$result" "//test3"

# testFolder should not exist amymore
assertFileDoesNotExist "5.8" "$projectName2/testFolder"

# Delete folder
rm -r $projectName2

# main.js should not exist in $projectName2
assertFileDoesNotExist "5.9" "$projectName2/main.js"

# Clone using projectName
gas clone $projectName2

# main.js should have a specific content in $projectName2
result=$(cat $projectName2/main.js)
pattern="//main modified"
assertRegex "5.10" "$result" "$pattern"

# ID should exist in $projectName2/.gas and have projectId2 as content
result=$(cat $projectName2/.gas/ID)
assertRegex "5.11" "$result" "$projectId2"

# Testing gas new
printf '\n[New test]\n'

# Project we are going to create should not exist yet
result=$(gas list $projectName4)
pattern="No script projects matching the filter found in your Google Drive \[✘\]"
assertRegex "6.0" "$result" "$pattern"

gas new $projectName4

# Project we created shoud have info when we look it up using name
result=$(gas info $projectName4)
pattern="name:           $projectName4.*id:             (.{$idLenght}).*"
assertRegex "6.1" "$result" "$pattern"

# Parse projectId
projectId4=${BASH_REMATCH[1]}

# main.js should exist in $projectName4
result=$(cat $projectName4/main.js)
pattern="function myFunction\(\) \{.*\}"
assertRegex "6.2" "$result" "$pattern"

# ID should exist in $projectName4/.gas
result=$(cat $projectName4/.gas/ID)
assertRegex "6.3" "$result" "$projectId4"

# Testing gas include
printf '\n[Include test]\n'

# do gas include
# check that include file has been created

# write an include file
# cd $projectRootFolder2 || exit 1
# printf '//test1\n' > test1.js
# mkdir 'testFolder' && cd 'testFolder' || exit 1
# printf '//test2\n' > test2.js
# cd ..
# mkdir 'testFolder2' && cd 'testFolder2' || exit 1
# mkdir 'testFolder3' && cd 'testFolder3' || exit 1
# printf '//test3\n' > test3.js
# cd ..
# cd ..
# gas push
# cd ..

# Cleaning up at the end by deleting remaining projects and folders
printf '\n[Cleaning up]\n'
gas delete $projectId2
gas delete $projectName4
rm -r $projectName2
rm -r $projectRootFolder2
rm -r $projectName4


printf "____________________________________________\n"
printf "Test result: $success/$total\n"

if [ $total -gt $success ];
then
    exit 1
else
    exit 0
fi
