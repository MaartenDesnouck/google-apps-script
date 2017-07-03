#!/bin/sh

succes=0;
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
echo '[Auth test]'

total=$(($total+1))
result=$(gas auth)
pattern="You are succesfully authenticated as '.*' \[✔\]";
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[1]"
    echo "  $result"
fi

# Testing gas list and gas create
echo '\n[List, info and create test]'

# Project we are going to create should not exist yet (1)
total=$(($total+1))
result=$(gas list $projectName1)
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    succes=$(($succes+1))
else
    echo "fail[2]"
    echo "  $result"
fi


# Project we are going to create should not exist yet (2)
total=$(($total+1))
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[3]"
    echo "  $result"
fi

# Create project 1
gas create $projectName1

# Project we created should be listable using name and have only one result
total=$(($total+1))
result=$(gas list $projectName1)
pattern="^\[(.{$idLenght})\] $projectName1$"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[4]"
    echo "  $result"
fi

# Parse projectId
projectId1=${BASH_REMATCH[1]}

# Project we created shoud have info when we look it up using name
total=$(($total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[5]"
    echo "  $result"
fi

# Project we created should have info when we look it up using id
total=$(($total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[6]"
    echo "  $result"
fi

# Second project we are going to create should not exist yet
result=$(gas list $projectName2)
total=$(($total+1))
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    succes=$(($succes+1))
else
    echo "fail[7]"
    echo "  $result"
fi

# Create project 2
gas create $projectName2

# Second project we created should be listable using name and have only one result
total=$(($total+1))
result=$(gas list $projectName2)
pattern="^\[(.{$idLenght})\] $projectName2$"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[8]"
    echo "  $result"
fi

# Parse project id
projectId2=${BASH_REMATCH[1]}

# Second project we created should have info when we look it up using id
total=$(($total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[9]"
    echo "  $result"
fi

# List with filter on common part should give us 2 results
total=$(($total+1))
result=$(gas list $commonPart)
pattern="\[$projectId1\] $projectName1.*\[$projectId2\] $projectName2.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[10]"
    echo "  $result"
fi

# Testing gas rename
echo '\n[Rename test]'

# Project we are going to rename should exist
total=$(($total+1))
result=$(gas info $projectId1)
pattern="name:           $projectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[11]"
    echo "  $result"
fi

# Rename project
gas rename $projectName1 $newProjectName1

# Project with new name exists and still has the same id
total=$(($total+1))
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[12]"
    echo "  $result"
fi

# Project with old name no longer exists
total=$(($total+1))
result=$(gas info $projectName1)
pattern="No project with name or id '$projectName1' found in your Google Drive [✘]*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[13]"
    echo "  $result"
fi

# Project with old id has a new name
total=$(($total+1))
result=$(gas info $projectId1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[14]"
    echo "  $result"
fi

# Testing gas delete
echo '\n[Delete test]'

# Project we are going to delete should exists
total=$(($total+1))
result=$(gas info $newProjectName1)
pattern="name:           $newProjectName1.*id:             $projectId1.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[15]"
    echo "  $result"
fi

# Delete by name
gas delete $newProjectName1

# Project we deleted should no longer exists based on name
total=$(($total+1))
result=$(gas info $newProjectName1)
pattern="No project with name or id '$newProjectName1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[16]"
    echo "  $result"
fi

# Project we deleted should no longer exists based on id
total=$(($total+1))
result=$(gas info $projectId1)
pattern="No project with name or id '$projectId1' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[17]"
    echo "  $result"
fi

# Create new project
gas create $projectName3

# Project we are going to delete should exist based on name
total=$(($total+1))
result=$(gas info $projectName3)
pattern="name:           $projectName3.*id:             (.{$idLenght}).*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[18]"
    echo "  $result"
fi

# Parse projectId
projectId3=${BASH_REMATCH[1]}

# Project we are going to delete should exist based on id
total=$(($total+1))
result=$(gas info $projectId3)
pattern="name:           $projectName3.*id:             $projectId3.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[19]"
    echo "  $result"
fi

# Delete project based on id
gas delete $projectId3

# Project we deleted should no longer exist based on name
total=$(($total+1))
result=$(gas info $projectName3)
pattern="No project with name or id '$projectName3' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[20]"
    echo "  $result"
fi

# Project we deleted should no longer exist based on id
total=$(($total+1))
result=$(gas info $projectId3)
pattern="No project with name or id '$projectId3' found in your Google Drive \[✘\].*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[21]"
    echo "  $result"
fi

# Testing gas link and pull
echo '\n[Link and pull test]'

# Project we are going to link and pull should exists
total=$(($total+1))
result=$(gas info $projectId2)
pattern="name:           $projectName2.*id:             $projectId2.*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[22]"
    echo "  $result"
fi

#Linking and pulling using projectId
mkdir $projectRootFolder2
cd $projectRootFolder2
gas link $projectId2
gas pull
cd ..

# Main.js should exist in $projectRootFolder2
total=$(($total+1))
result=$(cat $projectRootFolder2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[23]"
    echo "  $result"
fi

# ID should exist in $projectRootFolder2/.gas
total=$(($total+1))
result=$(cat $projectRootFolder2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    succes=$(($succes+1))
else
    echo "fail[24]"
    echo "  $result"
fi

# Testing gas push and clone
echo '\n[Push and clone test]'
# Create some files and folders and push them
cd $projectRootFolder2
echo '//test1' > test1.js
mkdir 'testFolder' && cd 'testFolder'
echo '//test2' > test2.js
cd ..
mkdir 'testFolder2' && cd 'testFolder2'
mkdir 'testFolder3' && cd 'testFolder3'
echo '//test3' > test3.js
cd ..
cd ..
gas push
cd ..

# Clone using projectId
gas clone $projectId2

# test1.js should exist in $projectName2
total=$(($total+1))
result=$(cat $projectName2/test1.js)
content='//test1';
if [ "$result" = "$content" ];
then
    succes=$(($succes+1))
else
    echo "fail[25]"
    echo "  $result"
fi

# test2.js should exist in $projectName2/testFolder
total=$(($total+1))
result=$(cat $projectName2/testFolder/test2.js)
content='//test2';
if [ "$result" = "$content" ];
then
    succes=$(($succes+1))
else
    echo "fail[26]"
    echo "  $result"
fi

# test3.js should exist in $projectRootFolder2/testFolder2/testFolder3
total=$(($total+1))
result=$(cat $projectRootFolder2/testFolder2/testFolder3/test3.js)
content='//test3';
if [ "$result" = "$content" ];
then
    succes=$(($succes+1))
else
    echo "fail[27]"
    echo "  $result"
fi

# main.js should exist in $projectName2
total=$(($total+1))
result=$(cat $projectName2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[28]"
    echo "  $result"
fi

# .gitignore should exist in $projectName2
total=$(($total+1))
if [ -f $projectName2/.gitignore ];
then
    succes=$(($succes+1))
else
    echo "fail[29]"
    echo "$(cat .gitignore)"
fi

# ID should exist in $projectName2/.gas
total=$(($total+1))
result=$(cat $projectName2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    succes=$(($succes+1))
else
    echo "fail[30]"
    echo "  $result"
fi

# Delete test2.js and push from projectRootFolder2 and pull in projectName2
cd $projectRootFolder2
rm testFolder/test2.js
gas push
cd ..
cd $projectName2
gas pull
cd ..

# test2.js should not exist anymore
total=$(($total+1))
if [ ! -f $projectName2/test/test2.js ];
then
    succes=$(($succes+1))
else
    echo "fail[31]"
fi

# test3.js should exist in $projectName2/testFolder2/testFolder3
total=$(($total+1))
result=$(cat $projectName2/testFolder2/testFolder3/test3.js)
content='//test3';
if [ "$result" = "$content" ];
then
    succes=$(($succes+1))
else
    echo "fail[32]"
    echo "  $result"
fi

# testFolder should not exist amymore
# test2.js should not exist anymore
total=$(($total+1))
if [ ! -e $projectName2/testFolder ];
then
    succes=$(($succes+1))
else
    echo "fail[33]"
fi

# Delete folder
rm -r $projectName2

# main.js should not in $projectName2
total=$(($total+1))
if [ ! -f $projectName2/main.js ];
then
    succes=$(($succes+1))
else
    echo "fail[34]"
fi

# Clone using projectName
gas clone $projectName2

# main.js should exist in $projectName2
total=$(($total+1))
result=$(cat $projectName2/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[35]"
    echo "  $result"
fi

# ID should exist in $projectName2/.gas
total=$(($total+1))
result=$(cat $projectName2/.gas/ID)
if [ "$result" = $projectId2 ];
then
    succes=$(($succes+1))
else
    echo "fail[36]"
    echo "  $result"
fi


# Testing gas new
echo '\n[New test]'

# Project we are going to create should not exist yet
total=$(($total+1))
result=$(gas list $projectName4)
if [ "$result" = "No script projects matching the filter found in your Google Drive [✘]" ];
then
    succes=$(($succes+1))
else
    echo "fail[37]"
    echo "  $result"
fi

gas new $projectName4

# Project we created shoud have info when we look it up using name
total=$(($total+1))
result=$(gas info $projectName4)
pattern="name:           $projectName4.*id:             (.{$idLenght}).*"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[38]"
    echo "  $result"
fi

# Parse projectId
projectId4=${BASH_REMATCH[1]}

# main.js should exist in $projectName4
total=$(($total+1))
result=$(cat $projectName4/main.js)
pattern="function myFunction\(\) \{.*\}"
if [[ "$result" =~ $pattern ]];
then
    succes=$(($succes+1))
else
    echo "fail[39]"
    echo "  $result"
fi

# ID should exist in $projectName4/.gas
total=$(($total+1))
result=$(cat $projectName4/.gas/ID)
if [ "$result" = $projectId4 ];
then
    succes=$(($succes+1))
else
    echo "fail[40]"
    echo "  $result"
fi

# TODO testing gas include

# Cleaning up at the end by deleting remaining projects and folders
gas delete $projectId2
gas delete $projectName4
rm -r $projectName2
rm -r $projectRootFolder2
rm -r $projectName4


echo "-------------------------------------"
echo "Test result: $(($succes))/$total"

if [ $total -gt $succes ];
then
    exit 1
else
    exit 0
fi
