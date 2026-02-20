const { AmplifyAuthCognitoStackTemplate } = require('@aws-amplify/cli-extensibility-helper');

/**
 * @param {AmplifyAuthCognitoStackTemplate} resources 
 */
function override(resources) {
    const lambdaFunctionName = `S3Triggercf3892c7-${env}`; // замените на имя вашей функции

    // Способ 1: Через прямое добавление свойства
    resources.userPool.addPropertyOverride('LambdaConfig', {
        PostConfirmation: {
            'Fn::GetAtt': [`function${lambdaFunctionName}`, 'Outputs.Arn']
        }
    });

    // Добавление разрешения для Lambda
    resources.addCfnResource('PostConfirmationLambdaInvokePermission', {
        Type: 'AWS::Lambda::Permission',
        Properties: {
            FunctionName: {
                'Fn::GetAtt': [`function${lambdaFunctionName}`, 'Outputs.Arn']
            },
            Action: 'lambda:InvokeFunction',
            Principal: 'cognito-idp.amazonaws.com',
            SourceArn: {
                'Fn::GetAtt': ['UserPool', 'Arn']
            }
        }
    });
}

module.exports = { override };
