#!/bin/sh

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

# Testing auth
printf '\n[Auth test]\n'

total=$((total+1))
result=$(gas auth)
pattern="You are successfully authenticated as '.*' \[✔\]";
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[1]\n"
    printf "  $result\n"
fi

# Testing gas list and gas create
printf '\n[List, info and create test]\n'

# Project we are going to create should not exist yet (1)
total=$((total+1))
result=$(gas list $projectName1)
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    success=$((success+1))
else
    printf "fail[2]\n"
    printf "  $result\n"
fi


# Project we are going to create should not exist yet (2)
total=$((total+1))
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[3]\n"
    printf "  $result\n"
fi

# Create project 1
gas create $projectName1

# Project we created should be listable using name and have only one result
total=$((total+1))
result=$(gas list $projectName1)
pattern="^\[(.{$idLenght})\] $projectName1$"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[4]\n"
    printf "  $result\n"
fi

# Parse projectId
projectId1=${BASH_REMATCH[1]}

# Project we created shoud have info when we look it up using name
total=$((total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[5]\n"
    printf "  $result\n"
fi

# Project we created should have info when we look it up using id
total=$((total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[6]\n"
    printf "  $result\n"
fi

# Second project we are going to create should not exist yet
result=$(gas list $projectName2)
total=$((total+1))
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    success=$((success+1))
else
    printf "fail[7]\n"
    printf "  $result\n"
fi

# Create project 2
gas create $projectName2

# Second project we created should be listable using name and have only one result
total=$((total+1))
result=$(gas list $projectName2)
pattern="^\[(.{$idLenght})\] $projectName2$"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[8]\n"
    printf "  $result\n"
fi

# Parse project id
projectId2=${BASH_REMATCH[1]}

# Second project we created should have info when we look it up using id
total=$((total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[9]\n"
    printf "  $result\n"
fi

# List with filter on common part should give us 2 results
total=$((total+1))
result=$(gas list $commonPart)
pattern="\[$projectId1\] $projectName1.*\[$projectId2\] $projectName2.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[10]\n"
    printf "  $result\n"
fi

# Testing gas rename
printf '\n[Rename test]\n'

# Project we are going to rename should exist
total=$((total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[11]\n"
    printf "  $result\n"
fi

# Rename project
gas rename $projectName1 $newProjectName1

# Project with new name exists and still has the same id
total=$((total+1))
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[12]\n"
    printf "  $result\n"
fi

# Project with old name no longer exists
total=$((total+1))
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive [✘]*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[13]\n"
    printf "  $result\n"
fi

# Project with old id has a new name
total=$((total+1))
result=$(gas info $projectId1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[14]\n"
    printf "  $result\n"
fi

# Testing gas delete
printf "\n[Delete test]\n"

# Project we are going to delete should exists
total=$((total+1))
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[15]\n"
    printf "  $result\n"
fi

# Delete by name
gas delete $newProjectName1

# Project we deleted should no longer exists based on name
total=$((total+1))
result=$(gas info $newProjectName1)
pattern="No project with name or id '$newProjectName1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[16]\n"
    printf "  $result\n"
fi

# Project we deleted should no longer exists based on id
total=$((total+1))
result=$(gas info $projectId1)
pattern="No project with name or id '$projectId1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[17]\n"
    printf "  $result\n"
fi

# Create new project
gas create $projectName3

# Project we are going to delete should exist based on name
total=$((total+1))
result=$(gas info $projectName3)
pattern="name:           $projectName3.*id:             (.{$idLenght}).*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[18]\n"
    printf "  $result\n"
fi

# Parse projectId
projectId3=${BASH_REMATCH[1]}

# Project we are going to delete should exist based on id
total=$((total+1))
result=$(gas info $projectId3)
pattern="name:           $projectName3.*id:             $projectId3.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[19]\n"
    printf "  $result\n"
fi

# Delete project based on id
gas delete $projectId3

# Project we deleted should no longer exist based on name
total=$((total+1))
result=$(gas info $projectName3)
pattern="No project with name or id '$projectName3' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[20]\n"
    printf "  $result\n"
fi

# Project we deleted should no longer exist based on id
total=$((total+1))
result=$(gas info $projectId3)
pattern="No project with name or id '$projectId3' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[21]\n"
    printf "  $result\n"
fi

# Testing gas link and pull
printf '\n[Link and pull test]\n'

# Project we are going to link and pull should exists
total=$((total+1))
result=$(gas info $projectId2)
pattern="name:           $projectName2.*id:             $projectId2.*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[22]\n"
    printf "  $result\n"
fi

#Linking and pulling using projectId
mkdir $projectRootFolder2
cd $projectRootFolder2
gas link $projectId2
gas pull
cd ..

# Main.js should exist in $projectRootFolder2
total=$((total+1))
result=$(cat $projectRootFolder2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[23]\n"
    printf "  $result\n"
fi

# ID should exist in $projectRootFolder2/.gas
total=$((total+1))
result=$(cat $projectRootFolder2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    success=$((success+1))
else
    printf "fail[24]\n"
    printf "  $result\n"
fi

# Testing gas push and clone
printf '\n[Push and clone test]\n'
# Create some files and folders and push them
cd $projectRootFolder2 || exit
printf '//test1\n' > test1.js
mkdir 'testFolder' && cd 'testFolder' || exit
printf '//test2\n' > test2.js
cd ..
mkdir 'testFolder2' && cd 'testFolder2' || exit
mkdir 'testFolder3' && cd 'testFolder3' || exit
printf '//test3\n' > test3.js
cd ..
cd ..
gas push
cd ..

# Clone using projectId
gas clone $projectId2

# test1.js should exist in $projectName2
total=$((total+1))
result=$(cat $projectName2/test1.js)
content='//test1';
if [ "$result" = "$content" ];
then
    success=$((success+1))
else
    printf "fail[25]\n"
    printf "  $result\n"
fi

# test2.js should exist in $projectName2/testFolder
total=$((total+1))
result=$(cat $projectName2/testFolder/test2.js)
content='//test2';
if [ "$result" = "$content" ];
then
    success=$((success+1))
else
    printf "fail[26]\n"
    printf "  $result\n"
fi

# test3.js should exist in $projectRootFolder2/testFolder2/testFolder3
total=$((total+1))
result=$(cat $projectRootFolder2/testFolder2/testFolder3/test3.js)
content='//test3';
if [ "$result" = "$content" ];
then
    success=$((success+1))
else
    printf "fail[27]\n"
    printf "  $result\n"
fi

# main.js should exist in $projectName2
total=$((total+1))
result=$(cat $projectName2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[28]\n"
    printf "  $result\n"
fi

# .gitignore should exist in $projectName2
total=$((total+1))
if [ -f $projectName2/.gitignore ];
then
    success=$((success+1))
else
    printf "fail[29]\n"
    printf "$(cat .gitignore)\n"
fi

# ID should exist in $projectName2/.gas
total=$((total+1))
result=$(cat $projectName2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    success=$((success+1))
else
    printf "fail[30]\n"
    printf "  $result\n"
fi

# Delete test2.js and push from projectRootFolder2 and pull in projectName2
cd $projectRootFolder2 || exit
rm testFolder/test2.js
gas push
cd ..
cd $projectName2 || exit
gas pull
cd ..

# test2.js should not exist anymore
total=$((total+1))
if [ ! -f $projectName2/test/test2.js ];
then
    success=$((success+1))
else
    printf "fail[31]\n"
fi

# test3.js should exist in $projectName2/testFolder2/testFolder3
total=$((total+1))
result=$(cat $projectName2/testFolder2/testFolder3/test3.js)
content='//test3';
if [ "$result" = "$content" ];
then
    success=$((success+1))
else
    printf "fail[32]\n"
    printf "  $result\n"
fi

# testFolder should not exist amymore
# test2.js should not exist anymore
total=$((total+1))
if [ ! -e $projectName2/testFolder ];
then
    success=$((success+1))
else
    printf "fail[33]\n"
fi

# Delete folder
rm -r $projectName2

# main.js should not in $projectName2
total=$((total+1))
if [ ! -f $projectName2/main.js ];
then
    success=$((success+1))
else
    printf "fail[34]\n"
fi

# Clone using projectName
gas clone $projectName2

# main.js should exist in $projectName2
total=$((total+1))
result=$(cat $projectName2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[35]\n"
    printf "  $result\n"
fi

# ID should exist in $projectName2/.gas
total=$((total+1))
result=$(cat $projectName2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    success=$((success+1))
else
    printf "fail[36]\n"
    printf "  $result\n"
fi


# Testing gas new
printf '\n[New test]\n'

# Project we are going to create should not exist yet
total=$((total+1))
result=$(gas list $projectName4)
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    success=$((success+1))
else
    printf "fail[37]\n"
    printf "  $result\n"
fi

gas new $projectName4

# Project we created shoud have info when we look it up using name
total=$((total+1))
result=$(gas info $projectName4)
pattern="name:           $projectName4.*id:             (.{$idLenght}).*"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[38]\n"
    printf "  $result\n"
fi

# Parse projectId
projectId4=${BASH_REMATCH[1]}

# main.js should exist in $projectName4
total=$((total+1))
result=$(cat $projectName4/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    success=$((success+1))
else
    printf "fail[39]\n"
    printf "  $result"
fi

# ID should exist in $projectName4/.gas
total=$((total+1))
result=$(cat $projectName4/.gas/ID)
if [ "$result" = $projectId4 ];
then
    success=$((success+1))
else
    printf "fail[40]\n"
    printf "  $result\n"
fi

# Testing gas include
printf '\n[Include test]\n'

# write an include file
# do gas include
# do gas push
# do gas pull

# Cleaning up at the end by deleting remaining projects and folders
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
