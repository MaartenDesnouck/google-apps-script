#!/bin/sh

epoch=$(date +%s)
fail=0;
total=0;

# Testing auth
echo '[Auth test]'

    total=$(($total+1))
    result=$(gas auth)
    if [ "$result" != 'You are succesfully authenticated [✔]' ];
    then
        echo "  fail[1]: gas auth"
        echo "  $result"
        fail=$(($fail+1))
    fi

# Testing gas list and gas create
echo '\n[List and create test]'

    result=$(gas list gas_e2e_test)
    total=$(($total+1))
    if [ "$result" = "No script projects matching your filter found in Google Drive [✘]" ];
    then
        echo "  fail[2]: gas list gas_e2e_test_$epoch"
        echo "  $result"
        fail=$(($fail+1))
    fi

    total=$(($total+1))
    result=$(gas create gas_e2e_test_$epoch)
    pattern="Creating 'gas_e2e_test_$epoch' in Google Drive\.\.\. \[✔\].\[.{57}\] gas_e2e_test_$epoch"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[3]: gas create gas_e2e_test_$epoch [1]"
        echo "  $result"
        fail=$(($fail+1))
    fi

    total=$(($total+1))
    result=$(gas list gas_e2e_test_$epoch)
    pattern="^\[.{57}\] gas_e2e_test_$epoch$"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[4]: gas list gas_e2e_test_$epoch [2]"
        echo "  $result"
        fail=$(($fail+1))
    fi

# Testing gas delete
echo '\n[Delete test]'

    total=$(($total+1))
    result=$(gas list gas_e2e_test_$epoch)
    pattern="^\[.{57}\] gas_e2e_test_$epoch$"
    if [[ ! "$result" =~ $pattern ]];
    then
        echo "  fail[5]: gas list gas_e2e_test_$epoch"
        echo "  $result"
        fail=$(($fail+1))
    fi

    gas delete gas_e2e_test_$epoch
    # Can't test output because this of process.stdout.clearLine();

    result=$(gas list gas_e2e_test_$epoch)
    total=$(($total+1))
    if [ "$result" != "No script projects matching your filter found in Google Drive [✘]" ];
    then
        echo "  fail[6]: gas list gas_e2e_test_$epoch"
        echo "  $result"
        fail=$(($fail+1))
    fi

# TODO Testing gas rename
# TODO Testing gas pull
# TODO Testing gas clone
# TODO Testing gas new
# TODO Testing gas push
# TODO testing link
# TODO testing gas include


echo "-------------------------------------"
echo "Test result: $(($total-$fail))/$total"
