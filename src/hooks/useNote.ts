import { useContext } from 'react';
import { NoteProviderContext } from '../provider/NoteProvider';


export default function useNote() {
	const context = useContext(NoteProviderContext);
	if (!context) {
		throw new Error('useNote must be used within a NoteProvider');
	}
	return context;

}