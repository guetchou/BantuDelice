#!/usr/bin/env node

import fs from 'fs';

const filePath = 'frontend/src/pages/colis/ColisExpeditionModernFixed.tsx';

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer la fonction handleSubmit pour intégrer les vraies APIs
  const newHandleSubmit = `
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validation finale avant soumission
      const finalValidation = validateStepWithErrors(5);
      if (!finalValidation.isValid) {
        setStepErrors(prev => ({ ...prev, 5: finalValidation.errors }));
        setIsSubmitting(false);
        return;
      }

      // Préparer les données de paiement
      const paymentData = {
        amount: priceCalculation?.total || 0,
        method: formData.paymentMethod.toUpperCase(),
        phoneNumber: formData.phoneNumber,
        orderId: \`COLIS_\${Date.now()}\`,
        description: \`Expédition colis de \${formData.sender.city} vers \${formData.recipient.city}\`
      };

      console.log('💳 Données de paiement:', paymentData);

      // Appel API de paiement
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!paymentResponse.ok) {
        throw new Error('Erreur lors du traitement du paiement');
      }

      const paymentResult = await paymentResponse.json();
      console.log('✅ Paiement traité:', paymentResult);

      // Préparer les données d'expédition
      const expeditionData = {
        ...formData,
        paymentTransactionId: paymentResult.transactionId,
        totalAmount: priceCalculation?.total || 0
      };

      // Appel API de création d'expédition
      const expeditionResponse = await fetch('/api/colis/expedition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expeditionData)
      });

      if (!expeditionResponse.ok) {
        throw new Error('Erreur lors de la création de l\'expédition');
      }

      const expeditionResult = await expeditionResponse.json();
      console.log('📦 Expédition créée:', expeditionResult);

      // Sauvegarder les données pour la page de confirmation
      localStorage.setItem('expeditionData', JSON.stringify({
        ...expeditionData,
        trackingNumber: expeditionResult.data.trackingNumber,
        paymentResult: paymentResult
      }));

      // Envoyer les notifications
      await sendNotifications(expeditionData, expeditionResult.data.trackingNumber);

      setIsSubmitting(false);
      
      // Redirection vers la page de confirmation
      navigate('/colis/expedition-complete');
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      setStepErrors(prev => ({ 
        ...prev, 
        5: [error.message || 'Erreur lors de la soumission de l\'expédition'] 
      }));
      setIsSubmitting(false);
    }
  };

  // Fonction pour envoyer les notifications
  const sendNotifications = async (expeditionData, trackingNumber) => {
    try {
      const notificationData = {
        trackingNumber,
        senderPhone: expeditionData.sender.phone,
        senderEmail: expeditionData.sender.email,
        recipientPhone: expeditionData.recipient.phone,
        recipientEmail: expeditionData.recipient.email,
        fromCity: expeditionData.sender.city,
        toCity: expeditionData.recipient.city,
        amount: expeditionData.totalAmount
      };

      // Appel API de notifications
      const notificationResponse = await fetch('/api/colis/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (notificationResponse.ok) {
        console.log('📱 Notifications envoyées avec succès');
      } else {
        console.warn('⚠️ Erreur lors de l\'envoi des notifications');
      }
    } catch (error) {
      console.warn('⚠️ Erreur notifications:', error);
    }
  };`;

  // Remplacer l'ancienne fonction handleSubmit
  const handleSubmitRegex = /const handleSubmit = async \(\) => \{[\s\S]*?\};/;
  content = content.replace(handleSubmitRegex, newHandleSubmit);

  // Ajouter la validation de l'étape 5 dans validateStepWithErrors
  const validateStep5Regex = /case 5:\s*\/\/ Validation de l'étape 5[\s\S]*?break;/;
  const newValidateStep5 = `case 5:
        // Validation de l'étape 5 - Paiement
        if (!formData.paymentMethod) {
          errors.push("Veuillez sélectionner une méthode de paiement");
        }
        
        if (formData.paymentMethod !== 'cash') {
          if (!formData.phoneNumber) {
            errors.push("Le numéro de téléphone est obligatoire pour le paiement mobile");
          } else if (!validatePhoneNumber(formData.phoneNumber)) {
            errors.push("Le numéro de téléphone n'est pas valide");
          }
        }
        
        if (formData.paymentMethod === 'cash') {
          if (!formData.cashAmount || parseFloat(formData.cashAmount) <= 0) {
            errors.push("Le montant en espèces doit être supérieur à 0");
          }
        }
        
        if (!priceCalculation) {
          errors.push("Le calcul de prix est obligatoire avant de continuer");
        }
        break;`;

  content = content.replace(validateStep5Regex, newValidateStep5);

  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Étape 5 corrigée avec intégration des APIs de paiement et notifications !');
  console.log('🔧 Modifications apportées:');
  console.log('   - Intégration API de paiement (/api/payments)');
  console.log('   - Intégration API d\'expédition (/api/colis/expedition)');
  console.log('   - Intégration API de notifications (/api/colis/notifications/send)');
  console.log('   - Validation complète de l\'étape 5');
  console.log('   - Gestion d\'erreurs robuste');
  console.log('   - Logs détaillés pour debugging');
  
} catch (error) {
  console.error('❌ Erreur lors de la correction de l\'étape 5:', error.message);
  process.exit(1);
} 