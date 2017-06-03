#!/bin/sh

fail=0;
total=0;

epoch=$(date +%s)

commonPart='gas_e2e'
projectName1=$commonPart'_'$epoch'_project1'
newProjectName1=$commonPart'_'$epoch'_project1_renamed'
projectId1=''

projectName2=$commonPart'_'$epoch'_project2'
projectId2=''

projectName3=$commonPart'_'$epoch'_project3'
projectId3=''

idLenght=57

# Setup
npm install
npm install request
npm link

# Testing auth
echo '[Auth test]'

    total=$(($total+1))
    result=$(gas auth)
    if [ "$result" != 'You are succesfully authenticated [✔]' ];
    then
        echo "  fail[1]"
        echo "  $result"
        fail=$(($fail+1))
    fi

# Testing gas list and gas create
echo '\n[List, info and create test]'

    # Project we are going to create should not exist yet (1)
    total=$(($total+1))
    result=$(gas list $projectName1)
    if [ "$result" != "No script projects matching the filter found in your Google Drive [✘]" ];
    then
        echo "  fail[2]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project we are going to create should not exist yet (2)
    total=$(($total+1))
    result=$(gas info $projectName1)
    pattern="No project with name or id '$projectName1' found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[3]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Create project 1
    gas create $projectName1

    # Project we created should be listable using name and have only one result
    total=$(($total+1))
    result=$(gas list $projectName1)
    pattern="^\[(.{$idLenght})\] $projectName1$"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[4]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Parse projectId
    projectId1=${BASH_REMATCH[1]}

    # Project we created shoud have info when we look it up using name
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="name:           $projectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[5]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project we created should have info when we look it up using id
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="name:           $projectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[6]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Second project we are going to create should not exist yet
    result=$(gas list $projectName2)
    total=$(($total+1))
    if [ "$result" != "No script projects matching the filter found in your Google Drive [✘]" ];
    then
        echo "  fail[7]: gas list $projectName2"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Create project 2
    gas create $projectName2

    # Second project we created should be listable using name and have only one result
    total=$(($total+1))
    result=$(gas list $projectName2)
    pattern="^\[(.{$idLenght})\] $projectName2$"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[8]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Parse project id
    projectId2=${BASH_REMATCH[1]}

    # Second project we created should have info when we look it up using id
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="name:           $projectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[9]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # List with filter on common part should give us 2 results
    total=$(($total+1))
    result=$(gas list $commonPart)
    pattern="\[$projectId1\] $projectName1.*\[$projectId2\] $projectName2.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[10]"
        echo "  $result"
        fail=$(($fail+1))
    fi

# Testing gas rename
echo '\n[Rename test]'

    # Project we are going to rename exists
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="name:           $projectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[11]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Rename project
    gas rename $projectName1 $newProjectName1

    # Project with new name exists and still has the same id
    total=$(($total+1))
    result=$(gas info $newProjectName1)
    pattern="name:           $newProjectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[12]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project with old name no longer exists
    total=$(($total+1))
    result=$(gas info $projectName1)
    pattern="No exact match found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[13]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project with old id has a new name
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="name:           $newProjectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[14]"
        echo "  $result"
        fail=$(($fail+1))
    fi


# Testing gas delete
echo '\n[Delete test]'

    # Project we are going to delete should exists
    total=$(($total+1))
    result=$(gas info $newProjectName1)
    pattern="name:           $newProjectName1.*id:             $projectId1.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[15]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Delete by name
    gas delete $newProjectName1

    # Project we deleted should no longer exists based on name
    total=$(($total+1))
    result=$(gas info $newProjectName1)
    pattern="No project with name or id '$newProjectName1' found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[16]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project we deleted should no longer exists based on id
    total=$(($total+1))
    result=$(gas info $projectId1)
    pattern="No project with name or id '$projectId1' found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[17]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Create new project
    gas create $projectName3

    # Project we are going to delete should exist based on name
    total=$(($total+1))
    result=$(gas info $projectName3)
    pattern="name:           $projectName3.*id:             (.{$idLenght}).*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[18]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Parse projectId
    projectId3=${BASH_REMATCH[1]}

    # Project we are going to delete should exist based on id
    total=$(($total+1))
    result=$(gas info $projectId3)
    pattern="name:           $projectName3.*id:             $projectId3.*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[19]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Delete project based on id
    gas delete $projectId3

    # Project we deleted should no longer exist based on name
    total=$(($total+1))
    result=$(gas info $projectName3)
    pattern="No project with name or id '$projectName3' found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[20]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    # Project we deleted should no longer exist based on id
    total=$(($total+1))
    result=$(gas info $projectId3)
    pattern="No project with name or id '$projectId3' found in your Google Drive \[✘\].*"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[21]"
        echo "  $result"
        fail=$(($fail+1))
    fi

# TODO Testing gas pull
# TODO Testing gas clone
# TODO Testing gas new
# TODO Testing gas push
# TODO testing link
# TODO testing gas include

# TODO Cleaning up at the end by deleting



echo "-------------------------------------"
echo "Test result: $(($total-$fail))/$total"

if [ $fail -gt 0 ];
then
    exit 1
else
    exit 0
fi
